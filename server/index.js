const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;


app.use(cors());
app.use(express.json());



const balances = {
  "90206fe24bf2c0c80e381982d8e968b76cd1524d": 100,
  "d7d8806c268d706776f878f36ea6b6eea1e181cd": 50,
  "8f25c3e17106f96b57eb7bd00907c5cfc4232fc8": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
