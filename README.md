# Develop in local machine
## Pinocchio server

Pinocchio server in node.js. This server will handle backend requests and serve the website for users to visit.

## Prerequisites

* docker
* docker-compose
* aws-cli

# Development environment

The development environment is using a dynamoDB local instance. 

1. Configure `config.js` for the node server to use. **Note:** `mailAuth` requires using less secure access for gmail accounts (https://myaccount.google.com/lesssecureapps). Please ask Brian for email credentials.
2. Set up `aws-cli` with teh following configuration:
    - aws configure
        - Access Key ID: foo
        - Secret Access Key: bar
        - Default region name: local
        - Default output format: json
3. Run `docker-compose up --build`. This will create two containers: web and dynamo. The webserver will be on port `3010` for development purposes and the dynamo database container will be available on port `8000`. These are default ports defined in `config.js` and `docker-compose.yml`.
4. Create `users` and `events` tables to dynamoDB.
    - Run `aws dynamodb create-table --cli-input-json file://src/data/create-users-table.json --endpoint-url http://localhost:8000`
    - Run `aws dynamodb create-table --cli-input-json file://src/data/create-events-table.json --endpoint-url http://localhost:8000`

The application is now ready to accept requests.

## Server routes

* refer to swagger docs
