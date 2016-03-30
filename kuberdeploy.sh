#! /bin/bash

# run this script from the root directory of the service to be deployed.
# need to provide 3 arguments: project id, service name, and version

# check arguments
if [ $# -ne 3 ]; then
  echo "You need to specify project, service, and version"
else
  PROJECT=$1
  SERVICE=$2
  VERSION=$3

  echo ${PROJECT}

  # build and push new docker image to gcloud
  # TODO: check if docker is running. exit and error if not
  # boot2docker start
  docker build -t gcr.io/$PROJECT/$SERVICE:$VERSION .
  exit
  gcloud docker push gcr.io/$PROJECT/$SERVICE:$VERSION

  # update kubernetes pods
  kubectl rolling-update $SERVICE-controller --image=gcr.io/$PROJECT/$SERVICE:$VERSION --update-period=2s
fi

