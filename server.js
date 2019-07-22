/*
server.js

starts server on port 3000
*/

const express = require('express');
const bodyParser = require('body-parser');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// load app config
const {reactServer} = require('./config.js');

// create express app
const app = express();
const portNumber = 3000;
const port = process.env.PORT || portNumber;

// swagger definition
const swaggerDefinition = {
  info: {
    title: 'Pinocchio node backend server',
    version: '1.0.0',
    description: 'API endpoints to handle Pinocchio system routes',
  },
  host: 'localhost:' + port,
  basePath: '/',
  securityDefinitions: {
    token: {
      type: 'apiKey',
      name: 'token',
      scheme: 'bearer',
      in: 'header',
    },
  },
};

// swagger options
const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// swagger docs endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// allow cross origin requests (CORS)
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', reactServer);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

require('./src/routes/index.js')(app);
require('./src/routes/accounts.router.js')(app);
require('./src/routes/events.router.js')(app);

// listen for requests
app.listen(port, () => {
  console.log('Server listening on port: ' + port);
});

module.exports = app;
