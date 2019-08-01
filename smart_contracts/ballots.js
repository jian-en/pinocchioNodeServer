const web3jsUtil = require("./web3-util");
const Tx = require("ethereumjs-tx").Transaction; // Sign the transactions

const web3js = web3jsUtil.web3js;
const contract = web3jsUtil.contract;
const myAddress = web3jsUtil.myAddress;
const contractAddress = web3jsUtil.contractAddress;
const privateKey = web3jsUtil.privateKey;

async function getBalance() {
  const balanceInWei = await web3js.eth.getBalance(myAddress);
  return web3js.utils.fromWei(balanceInWei);
}

async function transferEtherTo(publicKey) {
  const txCount = await web3js.eth.getTransactionCount(myAddress);
  const txObject = {
    to: publicKey,
    value: web3js.utils.toHex(web3js.utils.toWei('1', 'ether')),
    nonce: web3js.utils.toHex(txCount),
    // Investigate gasLimit and gasPrice
    gasLimit: web3js.utils.toHex(21000),
    gasPrice: web3js.utils.toHex(web3js.utils.toWei('2', 'gwei'))
  };
  const tx = new Tx(txObject);
  tx.sign(privateKey);
  const serializedTx = tx.serialize();
  const raw = '0x' + serializedTx.toString('hex');
  const txHash = await web3js.eth.sendSignedTransaction(raw);
  return txHash;
}

async function addOrganizer(organizerPublicKey) {
  const txCount = await web3js.eth.getTransactionCount(myAddress);
  const funcCall = contract.methods.addOrganizer(organizerPublicKey).encodeABI();
  const txObject = {
    to: contractAddress,
    data: funcCall,
    nonce: web3js.utils.toHex(txCount),
    // Investigate gasLimit and gasPrice
    gasLimit: web3js.utils.toHex(3000000),
    gasPrice: web3js.utils.toHex(web3js.utils.toWei('2', 'gwei'))
  };
  const tx = new Tx(txObject);
  tx.sign(privateKey);
  const serializedTx = tx.serialize();
  const raw = '0x' + serializedTx.toString('hex');
  return await web3js.eth.sendSignedTransaction(raw);
}

async function approveEvent(organizerPublicKey, eventId) {
  const txCount = await web3js.eth.getTransactionCount(myAddress);
  const funcCall = contract.methods.approveEvent(organizerPublicKey, eventId).encodeABI();
  const txObject = {
    to: contractAddress,
    data: funcCall,
    nonce: web3js.utils.toHex(txCount),
    // Investigate gasLimit and gasPrice
    gasLimit: web3js.utils.toHex(3000000),
    gasPrice: web3js.utils.toHex(web3js.utils.toWei('2', 'gwei'))
  };
  const tx = new Tx(txObject);
  tx.sign(privateKey);
  const serializedTx = tx.serialize();
  const raw = '0x' + serializedTx.toString('hex');
  const txHash = await web3js.eth.sendSignedTransaction(raw);
  return txHash;
}

module.exports = {
  //getBalance: getBalance,
  addOrganizer: addOrganizer,
  approveEvent: approveEvent
};
