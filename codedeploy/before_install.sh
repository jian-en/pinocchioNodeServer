#!/usr/bin/env bash
# clean up instance from before
if [ -d "/server" ]; then
  # Clean up previous app instance
  rm -rf /server;
fi

# set up for new app
mkdir /server

# remove unused docker volumes
docker volume prune -f
docker network prune -f

# remove dangling images
docker image prune -af
