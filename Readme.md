setup ingress 

```

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml


```

check its working or not


```
kubectl get pods -n ingress-nginx
```



get public ip of ingress

```
kubectl get svc -n ingress-nginx
```



GEt ingress pods



```
kubectl get pods -n ingress-nginx
```

check logs

```
kubectl logs -n ingress-nginx  ingress-nginx-controller-7f9bbf6ddd-tmntx --follow

```


