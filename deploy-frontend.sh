#!/bin/bash

# Script de despliegue para FadeBooker (Frontend -> Azure Static Web Apps)
# Requiere: Azure CLI (az) instalado y logueado

echo "🚀 Iniciando proceso de despliegue de Frontend..."

# 1. Variables (Ajustar según tu cuenta de Azure)
RESOURCE_GROUP="FadeBooker_RG"
SWA_NAME="fadebooker-frontend"
LOCATION="eastus2" # o tu región preferida
REPOSITORY_URL="https://github.com/floatinggxx/FadeBooker"

# 2. Verificar login de Azure
az account show > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Error: No pareces estar logueado en Azure CLI. Ejecuta 'az login' primero."
    exit 1
fi

echo "✅ Sesión de Azure verificada."

# 3. Crear Grupo de Recursos si no existe
echo "📂 Verificando grupo de recursos..."
az group create --name $RESOURCE_GROUP --location $LOCATION --output none

# 4. Crear Static Web App si no existe
# Nota: La primera vez requiere un token de GitHub si no se usa el flujo de GitHub Actions
# Pero para despliegues manuales usaremos 'az staticwebapp create'
echo "🌐 Configurando Azure Static Web App..."
az staticwebapp create \
    --name $SWA_NAME \
    --resource-group $RESOURCE_GROUP \
    --source $REPOSITORY_URL \
    --location $LOCATION \
    --branch main \
    --app-location "Producto/front-fadebooker" \
    --output-location "dist" \
    --login-with-github

echo "🏁 Configuración completada."
echo "💡 Nota: El despliegue se realizará automáticamente a través de GitHub Actions"
echo "   vinculado a tu repositorio tras la creación de este recurso."
