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

/**
 * When the organizer is approved, their public key will be written
 * to the smart contract.
 * @param string(address starting with '0x') organizerPublicKey
 * @returns {Promise<TransactionReceipt>}
 */
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

/**
 * Query the smart contract whether the public key is a valid
 * Organizer
 * @param organizerPublicKey
 * @returns {Promise<*>}
 */
async function checkOrganizer(organizerPublicKey) {
  return await contract.methods.isOrganizer(organizerPublicKey).call();
}

/**
 * When the event is approved, it should be written to the blockchain
 * @param string(address) organizerPublicKey
 * @param string eventId
 * @returns {Promise<TransactionReceipt>}
 */
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

/**
 * Check whether the eventId is approved or not
 * @param organizerPublicKey
 * @param eventId
 * @returns {Promise<boolean>}
 */
async function checkEventApproval(organizerPublicKey, eventId) {
   const ballot = await contract.methods.eventToBallot(eventId).call();
   return ballot.organizer === organizerPublicKey;
}

module.exports = {
  addOrganizer: addOrganizer,
  checkOrganizer: checkOrganizer,
  approveEvent: approveEvent,
  checkEventApproval: checkEventApproval
};
