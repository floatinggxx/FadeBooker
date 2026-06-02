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
echo -e "${YELLOW}🏗️  Paso 1 y 2: Construyendo y subiendo la imagen en Azure (ACR Build)...${NC}"
az acr build --registry fadebookerregistry --image fadebooker-backend:latest .
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error durante la construcción en Azure. Verifica tu conexión y permisos de ACR.${NC}"
    exit 1
fi

# 4. Configuración de Variables de Entorno (SMTP, MP y URLs)
echo -e "${YELLOW}⚙️  Paso 4: Sincronizando configuración de correo, pagos y URLs en Azure...${NC}"
az webapp config appsettings set --name fadebooker-backend-ok --resource-group FadeBooker --settings \
  EMAIL_HOST="smtp.gmail.com" \
  EMAIL_PORT="587" \
  EMAIL_USER="fadebooker@gmail.com" \
  EMAIL_PASS="swuzpmvoftysdgss" \
  EMAIL_SECURE="false" \
  FRONTEND_URL="https://fadebooker.azurewebsites.net" \
  BACKEND_URL="https://fadebooker-backend-ok.azurewebsites.net" \
  MP_PUBLIC_KEY="TEST-0e031eb2-170a-4392-948f-f31b9bedc7a6" \
  MP_ACCESS_TOKEN="TEST-5665486996902898-051416-609148471955da2954d129d9f4de93f2-1101313361"

# 5. Reinicio de la Web App para aplicar cambios
echo -e "${YELLOW}🔄 Paso 5: Reiniciando la Web App en Azure para refrescar el código...${NC}"
az webapp restart --name fadebooker-backend-ok --resource-group FadeBooker
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al reiniciar la Web App. Verifica el nombre del recurso.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ ¡Despliegue completado con éxito!${NC}"
echo -e "${BLUE}🔗 Endpoint de salud: https://fadebooker-backend-ok.azurewebsites.net/api/health${NC}"
echo -e "${BLUE}📄 Swagger Docs: https://fadebooker-backend-ok.azurewebsites.net/docs/swagger.json${NC}"
