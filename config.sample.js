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
  swaggerURL: 'localhost:3000'
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
  }
};

const awstest = {
  dynamodb: {
    region: 'us-east-1',
  },
  dynamoPublicEndpoint: 'http://localhost:8020',
  jwtSecret: 'pinocchioxdata61InTest',
  mailAuth: {
    user: 'xxx@gmail.com',
    password: 'password'
  },
  reactServer: '',
  swaggerURL: '3.92.34.83:3010'
};
const config = {
  dev,
  test,
  awstest
};

module.exports = config[env];
