const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes, hexToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

///1:0267eebf123dd4f8b7368e1ba634a71914b96daa36840d9df35f5ace3b52dfa9f8
///2:02f2603a1b31cd26380547f0b99a0cfbd6f5a2cb58854cddf803f5b981e8d19465
///3:0363238e4dfc13efa459519f939d04bc73f7e885b78a5f9775ac35aa089f0478ce

const balances = {
  "90206fe24bf2c0c80e381982d8e968b76cd1524d": 100,
  "d7d8806c268d706776f878f36ea6b6eea1e181cd": 50,
  "8f25c3e17106f96b57eb7bd00907c5cfc4232fc8": 75,
};

//Changed app.get to convert entered Public key(address) to the Stored Wallet Address in Index.js and send back Balance
app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const pubtoaddr = toHex(keccak256(hexToBytes(address).slice(1)).slice(-20));
  const balance = balances[pubtoaddr] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { signature, sender, msgHash, amount, recipient } = req.body;




  let sig = JSON.parse(signature);
  //console.log all the params recieved to check on server side if they are correctly recieved
  console.log(signature);
  console.log("public key address: " + sender);
  console.log("Amount: " + amount)
  console.log("recipient: " + recipient)
  console.log("msgHash: " + msgHash);
  sig.r = BigInt(sig.r);
  sig.s = BigInt(sig.s);



  const isVerified = secp256k1.verify(sig, msgHash, sender);
  if (!isVerified) {
    res.status(400).send({ message: "signature verification failed" });
  }

  const sender1 = toHex(keccak256(hexToBytes(sender).slice(1)).slice(-20));

  //if the console.log works then the program has passed all the stages above
  console.log("sender1 address: " + sender1);

  setInitialBalance(sender1);
  setInitialBalance(recipient);

  if (balances[sender1] < amount || amount < 0) {
    res.status(400).send({ message: "Not enough funds! or invalid Amount" });
  } else {
    balances[sender1] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender1] });
  }
  //final log 
  //this is only emitted if the transfer is successful
  console.log("Sent amount: " + amount + " from sender: " + sender1 + " to " + recipient + " Successfully");
});



app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
