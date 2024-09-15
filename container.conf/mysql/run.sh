#!/bin/bash


version=$1
user=$2
containerName=mysql

cd /home/$user/api-build/$containerName

if [ -z "$(podman network ls -n 2>&1 | grep "shared_network")" ];then
    podman network create shared_network
fi
if [ -z "$(podman pod ls -n 2>&1 | grep "mysql")" ];then
    podman pod create --name mysql --network shared_network -p3306:3306
fi

podman build --tag=travel-$containerName:$version -f /home/$user/api-build/$containerName/DockerFile .
podman container stop travel-$containerName 2>&1 > /dev/null
podman rm travel-$containerName 2>&1 > /dev/null

podman run -e MYSQL_ALLOW_EMPTY_PASSWORD=true --name travel-$containerName --pod mysql -d travel-$containerName:$version 2>&1 > /dev/null

startingLineNumber=-1
while [ $startingLineNumber -eq -1 ];do
    sleep 0.1

    startingLineNumber=$(podman logs travel-$containerName 2>&1 | grep -n "Ready for start up" | awk -F: '{print $1}')

    if [ -z $startingLineNumber ];then
        startingLineNumber=-1
    fi
done

started=false
while [ "$started" = "false" ];do
    sleep 0.1

    if [ -n "$(podman logs travel-$containerName 2>&1 | grep "mysqld: ready for connections")" ];then
        started=true
    fi
done
sleep 1


podman exec -i travel-$containerName mysql -u root < /home/$user/api-build/$containerName/init.sql
