#!/bin/bash

# 🎭 FadeBooker - Script de Despliegue Frontend PRO (Docker -> Azure App Service)
# Optimizado para ser 100% automático, "self-healing" y seguro.

# Colores para la terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Variables de Infraestructura (Detectadas)
RG="FadeBooker"
PLAN="fadebooker-plan-v3"
APP_NAME="fadebooker-frontend-app"
REGISTRY="fadebookerregistry"
IMAGE_NAME="fadebooker-frontend"
API_URL="https://fadebooker-backend-ok.azurewebsites.net/api"

echo -e "${BLUE}🚀 Iniciando despliegue de Frontend (Modo Automático)...${NC}"

# 1 y 2. Construcción y Push en la nube (ACR Build)
# Usamos 'az acr build' para no depender de Docker localmente.
# Inyectamos las variables de entorno para que Vite las use en la compilación.
echo -e "${YELLOW}🏗️  Paso 1 y 2: Construyendo imagen en Azure (ACR Build)...${NC}"
az acr build --registry $REGISTRY \
    --image $IMAGE_NAME:latest \
    --build-arg VITE_API_URL=$API_URL \
    --build-arg VITE_API_BASE_URL=$API_URL .
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error durante la construcción en Azure (ACR Build).${NC}"
    exit 1
fi

# 4. Gestión de la Web App (Existencia y Configuración)
echo -e "${YELLOW}🔍 Paso 4: Validando estado de Web App ${APP_NAME}...${NC}"
APP_EXISTS=$(az webapp list --query "[?name=='$APP_NAME'].name" -o tsv)

if [ -z "$APP_EXISTS" ]; then
    echo -e "${YELLOW}🏗️  Creando la Web App por primera vez...${NC}"
    az webapp create \
        --resource-group $RG \
        --plan $PLAN \
        --name $APP_NAME \
        --deployment-container-image-name $REGISTRY.azurecr.io/$IMAGE_NAME:latest
fi

# 5. Configuración de Entorno y Permisos (Self-healing)
echo -e "${YELLOW}⚙️  Paso 5: Configurando App Settings y Managed Identity (Permissions)...${NC}"

# Habilitar Managed Identity
PRINCIPAL_ID=$(az webapp identity assign --name $APP_NAME --resource-group $RG --query principalId -o tsv)

# Obtener ID del ACR para asignar permisos
ACR_ID=$(az acr show --name $REGISTRY --resource-group $RG --query id -o tsv)

# Asignar permiso AcrPull a la Web App (Solo si no existe ya un rol asignado similar)
echo -e "${YELLOW}🔓 Asignando permisos AcrPull a la Web App...${NC}"
az role assignment create \
    --assignee $PRINCIPAL_ID \
    --scope $ACR_ID \
    --role "AcrPull" 2>/dev/null || echo -e "${BLUE}ℹ️ Permiso ya otorgado anteriormente.${NC}"

# Configurar variables críticas
az webapp config appsettings set --resource-group $RG --name $APP_NAME --settings \
    WEBSITES_PORT=80 \
    DOCKER_REGISTRY_SERVER_URL="https://$REGISTRY.azurecr.io" \
    DOCKER_ENABLE_CI=true > /dev/null

# Forzar el uso de la imagen más reciente
az webapp config container set \
    --name $APP_NAME \
    --resource-group $RG \
    --docker-custom-image-name "$REGISTRY.azurecr.io/$IMAGE_NAME:latest" \
    --docker-registry-server-url "https://$REGISTRY.azurecr.io"

# 6. Finalización
echo -e "${YELLOW}🔄 Paso 6: Reiniciando Web App para aplicar cambios...${NC}"
az webapp restart --name $APP_NAME --resource-group $RG

echo -e "${GREEN}✅ ¡Frontend desplegado y configurado automáticamente!${NC}"
echo -e "${BLUE}🔗 URL: https://$(az webapp show --name $APP_NAME --resource-group $RG --query defaultHostName -o tsv)${NC}"

