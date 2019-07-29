const Web3 = require("web3");
const config = require("../config.js");
const contractData = require(config['contractAbi']);
const contractAddress = config['contractAddress'];

// Investigate more into those options
const PROVIDER_URI = config['providerURI'];
const OPTIONS = {
    defaultBlock: "latest",
    transactionConfirmationBlocks: 1,
    transactionBlockTimeout: 5
};

const web3js = new Web3(new Web3.providers.HttpProvider(PROVIDER_URI), null, OPTIONS);
const contract = new web3js.eth.Contract(contractData['abi'], contractAddress);

const myAddress = config['publicKey'];
const privateKey = Buffer.from(config['privateKey'], 'hex');

module.exports = {
    web3js: web3js,
    contract: contract,
    myAddress: myAddress,
    privateKey: privateKey
};
