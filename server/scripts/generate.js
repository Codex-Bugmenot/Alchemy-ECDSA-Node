
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes, hexToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");


const privatekey = secp256k1.utils.randomPrivateKey();
const publickey = secp256k1.getPublicKey(privatekey);
const addr = keccak256(publickey.slice(1)).slice(-20);

const a = ["c8e5cea472b86985c92670a1a6675665c59a2b39a6b58ffe659b7ac3a69ea861"];
const pub1 = secp256k1.getPublicKey(hexToBytes(a[0]));
const addr1 = keccak256(pub1.slice(1)).slice(-20);


// console.log("----Private Key----- :", toHex(privatekey));
// console.log("----Public Key------  :", toHex(publickey));
// console.log("----Address--------:", toHex(addr));
// console.log("----Address--------:", toHex(addr1));
console.log("----Public Key------  :", toHex(pub1));

