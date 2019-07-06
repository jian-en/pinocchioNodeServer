const env = process.env.NODE_ENV || 'dev';

const dev = {
 dynamodb: {
   accessKeyId: 'foo',
   secretAccessKey: 'bar',
   region: 'local',
   endpoint: 'http://dynamodb-container:8000',
 },
 jwtSecret: 'pinocchioxdata61',
 mailAuth: {
   user: 'xxx@gmail.com',
   password: 'password'
 },
 reactServer: 'http://localhost:3000'
};
const test = {
 dynamodb: {
   accessKeyId: 'foo',
   secretAccessKey: 'bar',
   region: 'local',
   endpoint: 'http://dynamodb-container:8000',
 },
 jwtSecret: 'pinocchioxdata61InTest',
 mailAuth: {
   user: 'xxx@gmail.com',
   password: 'password'
 }
};

const config = {
 dev,
 test
};

module.exports = config[env];
