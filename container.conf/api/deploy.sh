#!/bin/bash

project_base_dir="$1"
version=$2
user=$3
server_ip=$4

scp "$project_base_dir"/travel-impl/target/travel-impl-${version}-jar-with-dependencies.jar $user@$server_ip:/home/$user/api-build/api

