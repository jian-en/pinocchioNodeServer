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
  swaggerURL: 'localhost:3000',
  geocoder: {
    provider: 'opencage',
    apiKey: ''
  }
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
  privateKey: 'to-be-populated',
  mailAuth: {
    user: 'xxx@gmail.com',
    password: 'to-be-populated'
  },
  reactServer: '',
  swaggerURL: '3.92.34.83:3010',
  secretName: 'test/pinocchioNodeServer/aws'
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
