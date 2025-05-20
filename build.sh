#!/bin/bash

# Build the Docker image
IMAGE_NAME="ghcr.io/hardikhari96/kubectl/haripatel-dev-v2"
TAG="latest"

echo "Building Docker image..."
docker build -t ${IMAGE_NAME}:${TAG} .

echo "Tagging Docker image..."
docker tag ${IMAGE_NAME}:${TAG} ${IMAGE_NAME}:${TAG}


echo "Build and push completed successfully!"
