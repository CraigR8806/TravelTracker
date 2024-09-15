#!/bin/bash

project_base_dir="$1"
version=$2
user=$3
server_ip=$4

scp "$project_base_dir"/container.conf/mysql/init.sql $user@$server_ip:/home/$user/api-build/mysql

