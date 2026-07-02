#!/bin/bash
set -e

# Simple deploy script for frontend to Azure Container Registry
ACR_NAME=${ACR_NAME:-fadebookerregistrypro}
IMAGE_NAME="fadebooker-frontend"
TAG=${1:-latest}
ACR_LOGIN_SERVER="${ACR_NAME}.azurecr.io"
FULL_IMAGE_NAME="${ACR_LOGIN_SERVER}/${IMAGE_NAME}:${TAG}"

echo "🔐 Logging into ACR ${ACR_NAME}..."
az acr login --name "$ACR_NAME"

FRONT_DIR="Producto/front-fadebooker"
if [ ! -d "$FRONT_DIR" ]; then
  echo "❌ Frontend folder not found: $FRONT_DIR"
  exit 1
fi

pushd "$FRONT_DIR"
if [ ! -d node_modules ]; then
  echo "📦 Installing frontend dependencies..."
  npm install
fi

echo "🔨 Building frontend..."
npm run build

echo "📦 Building Docker image..."
docker build -t "$IMAGE_NAME:$TAG" .

echo "🏷 Tagging image for ACR: $FULL_IMAGE_NAME"
docker tag "$IMAGE_NAME:$TAG" "$FULL_IMAGE_NAME"

echo "📤 Pushing image to ACR..."
docker push "$FULL_IMAGE_NAME"

popd

echo "✅ Frontend deployed: $FULL_IMAGE_NAME"
exit 0
