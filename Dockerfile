# base image
FROM node:10-alpine

# set working directory
WORKDIR /app

# install dependencies
RUN apk add --update alpine-sdk
RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers make python

# install app dependencies
COPY package.json /app/package.json

COPY . .

RUN npm install --silent
