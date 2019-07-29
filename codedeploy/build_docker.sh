#!/usr/bin/env bash
# this is used by codedeploy
# Dockerfile and tag it as 'server:test'
cp /server/config.sample.js /server/config.js
git clone https://github.com/jian-en/pinocchioContract.git /server/smart_contracts/contracts
docker build -t server:test /server