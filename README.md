## Pinocchio server

Pinocchio server in node.js. This server will handle backend requests and serve the website for users to visit.

## Prerequisites

* node
* run `npm install` for dependencies

## Server setup

Run `node server.js`. This starts the server on port 3000. 

## Server routes

* `/` root is configured in `routes/index.js` and will currently return `hello world` on a GET request. This will eventually serve the website for visitors.
* `/pinocchio/` pinocchio endpoint is configured in `routes/pinocchio.js`. This will eventually serve the backend requests.
