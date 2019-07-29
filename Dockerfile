FROM node:10-alpine

RUN npm i npm@latest -g

WORKDIR /usr/app

# only copy necessary code
COPY . .

# install packages
RUN npm install --only-production --silent

# run commands are in the docker-compose yml files.
