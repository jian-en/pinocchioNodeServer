# run the built docker image in port 3010 (port mapped to
# 3000 in the container) (run container in detached)

# if container is exited
if [ ! "$(docker ps -q -f name=serverContainer)" ]; then
    if [ "$(docker ps -aq -f status=exited -f name=serverContainer)" ]; then
        # remove old client container
        docker rm -f serverContainer
    fi
fi

# if container is already running
if [ "$(docker ps -q -f name=serverContainer)" ]; then
    # remove old running client container
    docker rm -f serverContainer
fi

# start new server container
docker run --rm \
           -v /server:/user/app \
           -v /server/node_modules \
           -p 3010:3000 \
           --name serverContainer \
           --entrypoint "./entrypoint.sh" server:test