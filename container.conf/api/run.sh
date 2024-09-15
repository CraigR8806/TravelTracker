#!/bin/bash

version=$1
user=$2

cd /home/$user/api-build/api

if [ -z "$(podman network ls -n 2>&1 | grep "shared_network")" ];then
    podman network create shared_network
fi
if [ -z "$(podman pod ls -n 2>&1 | grep "api")" ];then
    podman pod create --name api -p8080:8080 --network shared_network
fi


podman build --tag=travel-api:$version -f /home/$user/api-build/api/DockerFile --build-arg version=$version .
podman run --pod api --restart=no --rm -d --name travel-api travel-api:$version
podman logs -f travel-api

podman container stop travel-api
