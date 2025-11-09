---
title: "Kubernetes Portfolio Hosting Infrastructure"
description: "Cost-effective portfolio website deployment on Kubernetes with Nginx load balancing and persistent storage"
year: 2024
tags: ["Kubernetes", "Nginx", "Rackspace", "DevOps", "Load Balancing"]
category: "personal"
---

Production-ready Kubernetes infrastructure hosting a portfolio website on Rackspace spot instances with high availability and persistent storage.

## Infrastructure Setup

- **2 Rackspace Spot Instances**: 16GB RAM, 4 vCPU each
- **Kubernetes Cluster**: Multi-node deployment
- **Nginx Service**: Layer 7 load balancer
- **Persistent Volume**: Shared storage for large files

## Implementation

### Load Balancing
- Nginx service distributes traffic across two portfolio pods
- Each pod runs on a separate instance for high availability
- Automatic failover and even traffic distribution

### Storage Management
- Persistent Volume (PV) created for large file storage
- Temporary pod used to upload and transfer files to volume
- Volume bound to main deployment for persistent access across pod restarts

## Architecture

Two-tier deployment with Nginx handling incoming traffic and distributing requests across portfolio pods on separate instances. Persistent storage mounted to deployments ensures data survives pod lifecycle events.

## Achievements

- Zero downtime deployments with multi-pod distribution
- Cost-optimized using spot instances while maintaining reliability
- Efficient large file management through temporary pod workflow

## Technologies

- Kubernetes
- Nginx (Service Load Balancer)
- Rackspace Cloud (Spot Instances)
- Persistent Volumes (PV/PVC)
- Docker
