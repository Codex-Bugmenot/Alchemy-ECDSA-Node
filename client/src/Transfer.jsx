import { useState } from "react";
import server from "./server";
import { toHex, utf8ToBytes, hexToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";
import { secp256k1 } from "ethereum-cryptography/secp256k1";


function hashMessage(message) {
  return keccak256(utf8ToBytes(message));

}
const keys = ["b1d62df1b4e70b372ce9a7c653d0a59821c9ccdfae9efeedb2374d9ddd393d16", "cba175afdce8a3863e8fb65c6837a8c28a3e2ecb7af8e28311517a3fd4bd1cd7", "c8e5cea472b86985c92670a1a6675665c59a2b39a6b58ffe659b7ac3a69ea861"];
async function sign(address, data) {
  for (let i = 0; i < keys.length; i++) {

    let publickey = secp256k1.getPublicKey(hexToBytes(keys[i]));

    let addr = toHex(keccak256(publickey.slice(1)).slice(-20));
    //converting the Public Key (address) to wallet address (addr1)
    //we can directly compare Public Keys since the conversion done below is a it roundabout 
    let addr1 = toHex(keccak256(hexToBytes(address.toString()).slice(1)).slice(-20));
    if (addr1 === addr) {
      let signature = await secp256k1.sign(data, hexToBytes(keys[i]));
      // one can console.log here just to check if the steps above work correctly

      const jsonSignature = JSON.stringify(signature, (key, value) =>
        typeof value === 'bigint'
          ? value.toString()
          : value
      );
      return jsonSignature;

    }
  }
}



function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");



  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();


    const Message = address + "_" + sendAmount + "_" + recipient;
    const Hash = toHex(hashMessage(Message));
    console.log("Hash is :", Hash);

    const signature = await sign(address, Hash);
    console.log("Signature is :", signature);

    try {
      //once we click thansfer these logs will be the first to be emitted
      console.log("public key address: " + address);
      console.log("sendAmount: " + sendAmount);
      console.log("recipient: " + recipient);
      const {
        data: { balance },
      } = await server.post(`send`, {
        signature: signature,
        sender: address,
        msgHash: Hash,
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}


export default Transfer;

