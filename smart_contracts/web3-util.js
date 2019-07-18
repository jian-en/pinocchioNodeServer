const Web3 = require("web3");
const Tx = require("ethereumjs-tx").Transaction; // Sign the transactions
const contractData = require("./BallotManager.json");
const contractAddress = "0x098019A65897Ced41E785036F3c44dAD358e802F";

// Investigate more into those options
const PROVIDER_URI = "http://127.0.0.1:7545";
const OPTIONS = {
    defaultBlock: "latest",
    transactionConfirmationBlocks: 1,
    transactionBlockTimeout: 5
};

const web3js = new Web3(new Web3.providers.HttpProvider(PROVIDER_URI), null, OPTIONS);
const contract = new web3js.eth.Contract(contractData['abi'], contractAddress);

const myAddress = '0x976bcD111D081c50E70D8e51f27E1E08782E73cD';
const privateKey = Buffer.from(process.env.PRIVATE_KEY, 'hex');

module.exports = {
    web3js: web3js,
    contract: contract,
    myAddress: myAddress,
    privateKey: privateKey
};
