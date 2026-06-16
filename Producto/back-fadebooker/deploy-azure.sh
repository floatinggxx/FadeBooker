#!/bin/bash

# ==============================================================================
# Script de Despliegue para FadeBooker Backend (Azure Container Registry)
# ==============================================================================

# Abortar en errores
set -e

# Colores para la salida
GREEN='\033[0;32m'
NC='\033[0m' # No Color
BLUE='\033[0;34m'

echo -e "${BLUE}🚀 Iniciando proceso de despliegue de FadeBooker Backend...${NC}"

# 1. Solicitar/Verificar variables
# Valores sugeridos: 
# ACR_NAME="fadebookeracr"
# FUNCTION_APP_NAME="fadebooker-api"

if [[ -z "$ACR_NAME" ]]; then
    read -p "Introduce el nombre de tu Azure Container Registry (ACR) [fadebookeracr]: " ACR_NAME
    ACR_NAME=${ACR_NAME:-fadebookeracr}
fi

if [[ -z "$ACR_NAME" ]]; then
    echo "❌ Error: El nombre del ACR es obligatorio."
    exit 1
fi

IMAGE_NAME="fadebooker-backend"
TAG=${1:-latest}
ACR_LOGIN_SERVER="${ACR_NAME}.azurecr.io"
FULL_IMAGE_NAME="${ACR_LOGIN_SERVER}/${IMAGE_NAME}:${TAG}"

# 2. Login en Azure (opcional si ya está logueado, pero recomendado)
echo -e "${BLUE}🔐 Verificando acceso a Azure Container Registry...${NC}"
az acr login --name "$ACR_NAME"

# 3. Build de la imagen Docker
# Asumimos que el script se ejecuta desde la raíz de back-fadebooker o desde /scripts
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
# Build context should be the back-fadebooker folder where this script lives
PROJECT_ROOT="$SCRIPT_DIR"

echo -e "${BLUE}📦 Construyendo imagen Docker: ${IMAGE_NAME}:${TAG}...${NC}"
docker build -t "$IMAGE_NAME:$TAG" "$PROJECT_ROOT"

# 4. Tagging
echo -e "${BLUE}🏷️ Etiquetando imagen para ACR...${NC}"
docker tag "$IMAGE_NAME:$TAG" "$FULL_IMAGE_NAME"

# 5. Push
echo -e "${BLUE}📤 Subiendo imagen a ${FULL_IMAGE_NAME}...${NC}"
docker push "$FULL_IMAGE_NAME"

echo -e "${GREEN}✅ ¡Despliegue completado con éxito!${NC}"
echo -e "La imagen está lista en: ${FULL_IMAGE_NAME}"
echo -e "Próximo paso: Configura tu Function App o App Service para usar esta imagen."
