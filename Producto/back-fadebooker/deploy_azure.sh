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

# 1 y 2. Construcción y Push en la nube (ACR Build)
# Usamos 'az acr build' porque no requiere tener Docker instalado ni corriendo localmente.
echo -e "${YELLOW}🏗️  Paso 1 y 2: Construyendo y subiendo la imagen (Docker Local)...${NC}"
# Login en ACR
az acr login --name fadebookerregistrypro

# Build local
docker build -t fadebookerregistrypro.azurecr.io/fadebooker-backend:latest .

# Push a Azure
docker push fadebookerregistrypro.azurecr.io/fadebooker-backend:latest

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error durante la construcción local o el push. Verifica que Docker esté corriendo.${NC}"
    exit 1
fi

# 4. Configuración de la Web App para que use la imagen de ACR
echo -e "${YELLOW}⚙️  Paso 4: Configurando credenciales del registro y variables...${NC}"

# Habilitar el usuario administrador si no lo está (opcional pero recomendado para este flujo simple)
az acr update --name fadebookerregistrypro --admin-enabled true > /dev/null

# Obtenemos la contraseña del registro (ACR)
ACR_PASS=$(az acr credential show --name fadebookerregistrypro --query passwords[0].value -o tsv 2>/dev/null)

if [ -z "$ACR_PASS" ]; then
    echo -e "${RED}❌ Error: No se pudo obtener la contraseña del ACR. Revisa tus permisos.${NC}"
    exit 1
fi

az webapp config container set --name fadebooker-backend-v2 --resource-group FadeBooker-New \
  --container-image-name fadebookerregistrypro.azurecr.io/fadebooker-backend:latest \
  --container-registry-url https://fadebookerregistrypro.azurecr.io \
  --container-registry-username fadebookerregistrypro \
  --container-registry-password "$ACR_PASS"

# 4.2 Configuración de Variables de Entorno (SMTP, MP y URLs)
echo -e "${YELLOW}⚙️  Paso 4.2: Sincronizando configuración de base de datos y entorno...${NC}"
az webapp config appsettings set --name fadebooker-backend-v2 --resource-group FadeBooker-New --settings \
  NODE_ENV="production" \
  WEBSITES_PORT="3000" \
  PORT="3000" \
  EMAIL_HOST="smtp.gmail.com" \
  EMAIL_PORT="587" \
  EMAIL_USER="fadebooker@gmail.com" \
  EMAIL_PASS="swuzpmvoftysdgss" \
  EMAIL_SECURE="false" \
  FRONTEND_URL="https://fadebooker-frontend-v2.azurewebsites.net" \
  BACKEND_URL="https://fadebooker-backend-v2.azurewebsites.net" \
  DB_SERVER="fadebooker-server-v2.database.windows.net" \
  DB_NAME="FadeBooker_DB" \
  DB_DATABASE="FadeBooker_DB" \
  DB_USER="adminuser" \
  DB_PASSWORD="F4deBooker.2026" \
  MP_PUBLIC_KEY="TEST-0e031eb2-170a-4392-948f-f31b9bedc7a6" \
  MP_ACCESS_TOKEN="TEST-5665486996902898-051416-609148471955da2954d129d9f4de93f2-1101313361" \
  SCM_DO_BUILD_DURING_DEPLOYMENT=false

# 5. Reinicio de la Web App para aplicar cambios
echo -e "${YELLOW}🔄 Paso 5: Reiniciando la Web App en Azure...${NC}"
az webapp restart --name fadebooker-backend-v2 --resource-group FadeBooker-New
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al reiniciar la Web App. Verifica el nombre del recurso.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ ¡Despliegue completado con éxito!${NC}"
echo -e "${BLUE}🔗 Endpoint de salud: https://fadebooker-backend-v2.azurewebsites.net/api/health${NC}"
echo -e "${BLUE}📄 Swagger Docs: https://fadebooker-backend-v2.azurewebsites.net/docs/swagger.json${NC}"

