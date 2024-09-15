#!/bin/bash

this_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd)

. $this_dir/.env

mvn clean install -U
if [ $? != 0 ];then
    exit 1
fi

deploy_container() {
    container=$1
    ssh $user@$server_ip "rm -rf /home/$user/api-build/$container;mkdir -p /home/$user/api-build/$container"

    scp container.conf/$container/DockerFile $user@$server_ip:/home/$user/api-build/$container
    scp container.conf/$container/run.sh $user@$server_ip:/home/$user/api-build/$container

    container.conf/$container/deploy.sh "$this_dir" $version $user $server_ip
    cd "$this_dir"
    
    ssh $user@$server_ip "chmod 700 /home/$user/api-build/$container/run.sh"
    ssh $user@$server_ip -t "/home/$user/api-build/$container/run.sh $version $user"
    ssh $user@$server_ip "rm -rf /home/$user/api-build/$container"

}

version="$(grep "<project-version>" pom.xml | sed -r "s%<\/?project-version>%%g" | tr -d ' ')"
user=$DEV_SERVER_USER
server_ip=$DEV_SERVER

if [ "$1" = "all" ];then
    deploy_container mysql
    deploy_container api
else
    deploy_container api
fi


