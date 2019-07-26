#!/usr/bin/env bash
# this is used by codedeploy
# Dockerfile and tag it as 'server:test'
cp /server/config.sample.js /server/config.js
docker build -t server:test /server