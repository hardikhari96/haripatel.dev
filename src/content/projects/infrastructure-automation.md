---
title: "Kubernetes Portfolio Hosting Infrastructure"
description: "Cost-effective portfolio website deployment on Kubernetes with Nginx load balancing and persistent storage"
year: 2024
tags: ["Kubernetes", "Nginx", "Rackspace", "DevOps", "Load Balancing"]
category: "personal"
---

A production-ready Kubernetes infrastructure for hosting a portfolio website on Rackspace spot instances with load balancing and persistent volume management.

## Project Scope

Designed and deployed a Kubernetes cluster on cost-effective Rackspace spot instances to host a portfolio website with high availability through load balancing and persistent data storage.

## Infrastructure Setup

- **2 Rackspace Spot Instances**: 16GB RAM, 4 vCPU each
- **Kubernetes Cluster**: Multi-node cluster across both instances
- **Nginx Service**: Layer 7 load balancer for traffic distribution
- **Persistent Volume**: Shared storage for application data

## Key Components

### Cluster Configuration
- Kubernetes cluster deployed across 2 Rackspace spot instances
- Each node with 16GB RAM and 4 CPU cores for optimal performance
- Cost-optimized using spot instances while maintaining reliability

### Load Balancing
- **Nginx Service**: Configured as Kubernetes service for load balancing
- **Portfolio Deployment**: Two pods distributed across both instances
- Traffic automatically balanced between pods for high availability
- Service-level load balancing ensures even distribution

### Storage Management
- Created Persistent Volume (PV) for large file storage
- Deployed temporary pod to upload and transfer large files to volume
- Bound volume to main deployment for persistent data access
- Volume accessible across pod restarts and rescheduling

## Architecture

The deployment uses a two-tier architecture with Nginx handling incoming traffic and distributing it across portfolio website pods running on separate instances. Persistent storage is mounted to deployments, ensuring data survives pod lifecycle events.

## Achievements

- Deployed production-grade Kubernetes cluster on cost-effective spot instances
- Achieved high availability with multi-pod deployment across instances
- Implemented efficient load balancing with Nginx service
- Successfully managed large file transfers using temporary pods and persistent volumes
- Zero downtime deployments with pod distribution

## Technologies

- Kubernetes
- Nginx (Service Load Balancer)
- Rackspace Cloud (Spot Instances)
- Persistent Volumes (PV/PVC)
- Docker containerization
