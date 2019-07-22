FROM node:10-alpine

RUN npm i npm@latest -g

WORKDIR /usr/app

# only copy necessary code
COPY package.json .
COPY server.js .
COPY src .
COPY config.js .
COPY entrypoint.sh .

# install packages
RUN npm install

# run commands are in the docker-compose yml files.
