#!/bin/bash

# 🎭 FadeBooker - Script de Despliegue Automático (Local a Azure)
# Este script automatiza el flujo: Login ACR -> Build Docker -> Push -> Restart WebApp

# Configuración de colores para la terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Iniciando el proceso de despliegue de FadeBooker...${NC}"

# 1. Autenticación en Azure Container Registry
echo -e "${YELLOW}🔑 Paso 1: Iniciando sesión en Azure Container Registry...${NC}"
az acr login --name fadebookerregistry
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al autenticar en el registro. Verifica que tengas el Azure CLI instalado y sesión iniciada (az login).${NC}"
    exit 1
fi

# 2. Construcción de la imagen Docker
echo -e "${YELLOW}🏗️  Paso 2: Construyendo la imagen Docker...${NC}"
docker build -t fadebookerregistry.azurecr.io/fadebooker-backend:latest .
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error durante la construcción de la imagen (docker build).${NC}"
    exit 1
fi

# 3. Push de la imagen a la nube
echo -e "${YELLOW}📤 Paso 3: Subiendo imagen al registro de Azure (Push)...${NC}"
docker push fadebookerregistry.azurecr.io/fadebooker-backend:latest
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al subir la imagen al ACR (docker push).${NC}"
    exit 1
fi

# 4. Reinicio de la Web App para aplicar cambios
echo -e "${YELLOW}🔄 Paso 4: Reiniciando la Web App en Azure para refrescar el código...${NC}"
az webapp restart --name fadebooker-backend-ok --resource-group FadeBooker
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al reiniciar la Web App. Verifica el nombre del recurso.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ ¡Despliegue completado con éxito!${NC}"
echo -e "${BLUE}🔗 Endpoint de salud: https://fadebooker-backend-ok.azurewebsites.net/api/health${NC}"
echo -e "${BLUE}📄 Swagger Docs: https://fadebooker-backend-ok.azurewebsites.net/docs/swagger.json${NC}"
