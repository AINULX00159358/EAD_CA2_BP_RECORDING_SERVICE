eval $(minikube docker-env)
docker build --no-cache --tag eadca2/bprecordingservice:v1 .
docker images
helm package helm/.
