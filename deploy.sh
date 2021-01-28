docker build -t bryjos44/kube-fibcalculator-client:latest -t bryjos44/kube-fibcalculator-client:$GIT_SHA -f ./client/Dockerfile ./client
docker build -t bryjos44/kube-fibcalculator-server:latest -t bryjos44/kube-fibcalculator-server:$GIT_SHA -f ./server/Dockerfile ./server
docker build -t bryjos44/kube-fibcalculator-worker:latest -t bryjos44/kube-fibcalculator-worker:$GIT_SHA -f ./worker/Dockerfile ./worker

docker push bryjos44/kube-fibcalculator-client:latest
docker push bryjos44/kube-fibcalculator-client:$GIT_SHA

docker push bryjos44/kube-fibcalculator-server:latest
docker push bryjos44/kube-fibcalculator-server:$GIT_SHA

docker push bryjos44/kube-fibcalculator-worker:latest
docker push bryjos44/kube-fibcalculator-worker:$GIT_SHA

kubectl apply -f k8s

kubectl set image deployments/server-deployment server=bryjos44/kube-fibcalculator-server:$GIT_SHA
kubectl set image deployments/client-deployment client=bryjos44/kube-fibcalculator-client:$GIT_SHA
kubectl set image deployments/worker-deployment worker=bryjos44/kube-fibcalculator-worker:$GIT_SHA