
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");


const privatekey = secp256k1.utils.randomPrivateKey();
const publickey = secp256k1.getPublicKey(privatekey);
const addr = keccak256(publickey.slice(1)).slice(-20);


console.log("----Private Key----- :", toHex(privatekey));
console.log("----Public Key------  :", toHex(publickey));
console.log("----Address--------:", toHex(addr));
