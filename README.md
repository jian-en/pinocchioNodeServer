# Develop in local machine
## Pinocchio server

Pinocchio server in node.js. This server will handle backend requests and serve the website for users to visit.

## Prerequisites

* docker
* docker-compose
* aws-cli

# Development environment

The development environment is using a dynamoDB local instance. 

**Note:** `config.js` must be set to the same environment as the docker-compose file.

1. Configure `config.js` for the node server to use. Be sure to point dynamodb to the correct endpoint and set whether to use `dev` or `test`. **Note:** `mailAuth` requires using less secure access for gmail accounts (https://myaccount.google.com/lesssecureapps). Please ask Brian for email credentials.
2. Set up `aws-cli` with teh following configuration:
    - aws configure
        - Access Key ID: foo
        - Secret Access Key: bar
        - Default region name: local
        - Default output format: json
3. Start the development environment by running `docker-compose up`. This will create two containers: web and dynamo. The webserver will be on port `3010` for development purposes and the dynamo database container will be available on port `8010`. Be sure that the `config.js` dynamo endpoint is using the service name with port `8000` (e.g. `http://dynamodb-dev-container:8000`), since web will communicate with dynamo through the docker network.

4. Create `users` and `events` tables to dynamoDB.
    - Run `npm run create-tables`.

The application is now ready to accept requests.

## Server routes

* refer to swagger docs `localhost:3010/api-docs`
