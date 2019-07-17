# Develop in local machine
## Pinocchio server

Pinocchio server in node.js. This server will handle backend requests and serve the website for users to visit.

## Prerequisites

* docker
* docker-compose
* aws-cli

# Development environment

The development environment is using a dynamoDB local instance. 

1. Configure `config.js` for the node server to use. Be sure to point dynamodb to the correct endpoint and set to use `dev`. **Note:** `mailAuth` requires using less secure access for gmail accounts (https://myaccount.google.com/lesssecureapps). Please ask Brian for email credentials.
2. Set up `aws-cli` with the following configuration:
    - aws configure
        - Access Key ID: foo
        - Secret Access Key: bar
        - Default region name: local
        - Default output format: json
    This is for local dyanamodb development environment.
3. Start the development environment by running `docker-compose -f docker-dev.yml up --build`. This will create two containers: web and dynamo. The webserver will be on port `3010` for development purposes and the dynamo database container will be available on port `8000`. Be sure that the `config.js` dynamo endpoint is using the service name with port `8000` (e.g. `http://dynamodb-dev-container:8000`), since web will communicate with dynamo through the docker network.
4. Create `users` and `events` tables to dynamoDB.
    - Run `npm run create-tables`.

The application is now ready to accept requests (default port `3010`).

## Run tests

Run `npm test` to run tests. This will create a separate application/container environment specifically for testing. See `package.json` or `run_tests.sh` for more details. To see more debugging information, modify `run_tests.sh` to include debug statements.

These tests run boundary unit tests created from CSV files from ACTS tool. This can be found in `src/tests/ACTS` and `src/tests/testData`. These tests also run some functional tests (e.g. checking login tokens with different APIs).

## Server routes

* refer to swagger docs `localhost:3010/api-docs`
