const secrets = require('./src/utils/secrets.js');
const env = process.env.NODE_ENV || 'dev';

const dev = {
  dynamodb: {
    accessKeyId: 'foo',
    secretAccessKey: 'bar',
    region: 'local',
    endpoint: 'http://dynamodb-dev-container:8000',
  },
  dynamoPublicEndpoint: 'http://localhost:8000',
  jwtSecret: 'pinocchioxdata61',
  mailAuth: {
    user: 'xxx@gmail.com',
    password: 'password'
  },
  reactServer: 'http://localhost:3000',
  geocoder: {
    provider: 'opencage',
    apiKey: ''
  },
  swaggerURL: 'localhost:3010',
  // TODO: combine dynamodb/transcribe config
  awsConfig: {
    accessKeyId: '',
    secretAccessKey: '',
    region: 'us-east-1'
   },
  awsS3: {
    uploadBucket: 'pinocchio-data61-audio',
    domain: 's3.us-east-1.amazonaws.com',
    protocol: 'https'
  },
  awsTranscribeConfig: {
    domain: 'transcribe.us-east-1.amazonaws.com',
    protocol: 'https'
  },
  awsTranscriptionJob: {
    LanguageCode: 'en-US',
    MediaFormat: 'mp3',
    TranscriptionJobName: '',
    Media: {
      MediaFileUri: ''
    },
    OutputBucketName: 'pinocchio-data61-transcriptions'
  },
  // SmartContract related
  providerURI: 'http://127.0.0.1:7545',
  publicKey: '0x976bcD111D081c50E70D8e51f27E1E08782E73cD',
  contractAddress: '0xb25AF8C3E64500008faa3F0F8379395B8910fF86',
  contractAbi: './contracts/local/BallotManager.json',
  privateKey: '5d524f41a86dd946dcc654a4fb8bd4a70d9bcd6325a72ba2f495fa87bcdbb6ee'
};

const test = {
  dynamodb: {
    accessKeyId: 'foo',
    secretAccessKey: 'bar',
    region: 'local',
    endpoint: process.env.NPM_TEST || 'http://dynamodb-test-container:8000',
  },
  dynamoPublicEndpoint: 'http://localhost:8020',
  jwtSecret: 'pinocchioxdata61InTest',
  mailAuth: {
    user: 'xxx@gmail.com',
    password: 'password'
  },
  reactServer: 'http://localhost:3000',
  swaggerURL: 'localhost:3000',
  geocoder: {
    provider: 'opencage',
    apiKey: ''
  }
};

const awstest = {
  dynamodb: {
    region: 'us-east-1',
  },
  dynamoPublicEndpoint: 'http://localhost:8020',
  jwtSecret: 'to-be-populated',
  mailAuth: {
    user: 'xxx@gmail.com',
    password: 'to-be-populated'
  },
  reactServer: 'http://3.92.34.83:3000',
  swaggerURL: '3.92.34.83:3010',
  geocoder: {
    provider: 'opencage',
    apiKey: ''
  },
  secretName: 'test/pinocchioNodeServer/aws',
  // SmartContract Related
  providerURI: 'http://3.92.34.83:8545',
  publicKey: '0xad9fcf012336038cf8c7202fecd939b42f900890',
  contractAddress: '0x485FBDA4D82F6b69ef4898a83761C83E24759633',
  contractAbi: './contracts/test/BallotManager.json',
  privateKey: 'to-be-populated'
};

const config = {
  dev,
  test,
  awstest
};

if (env === 'awstest') {
  secrets.getKey(config[env].secretName)
    .then(data => {
      config[env].mailAuth.password = data["mailPassword"];
      config[env].jwtSecret = data["jwtSecret"];
      config[env].privateKey = data["privateKey"];
    });
}

module.exports = config[env];
