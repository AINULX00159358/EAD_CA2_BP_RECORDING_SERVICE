#!/bin/bash
set -x	
#docker network create bpwebapp
docker run --name mongo --net bpwebapp -p 27017:27017 -d --rm mongo:latest
docker run --name bprecordingservice-test --net bpwebapp -p 30256:30256 -d --rm -e "MONGO_CONN_URI=mongodb://mongo:27017" bprecordingservice:CA2_TEST_V1
docker run --name bpdataservice-test --net bpwebapp -p 43256:43256 -d --rm -e "MONGO_CONN_URI=mongodb://mongo:27017" bpdataservice:CA2_TEST_V1
docker run --name bpinfoservice-test --net bpwebapp -p 22137:22137 -d --rm bpinfoservice:CA2_TEST_V1
docker ps
