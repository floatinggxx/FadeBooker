# 🎭 FadeBooker - Script de Despliegue Frontend para Windows (PowerShell)
Write-Host "🚀 Iniciando despliegue de Frontend (Modo Automático para Windows)..." -ForegroundColor Blue

# Variables de Infraestructura
$RG = "FadeBooker"
$PLAN = "fadebooker-plan-v3"
$APP_NAME = "fadebooker-frontend-app"
$REGISTRY = "fadebookerregistry"
$IMAGE_NAME = "fadebooker-frontend"
$API_URL = "https://fadebooker-backend-ok.azurewebsites.net/api"

# 1. Autenticación en Azure Container Registry
Write-Host "🔑 Paso 1: Autenticando en ACR ($REGISTRY)..." -ForegroundColor Yellow
az acr login --name $REGISTRY
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al autenticar en ACR." -ForegroundColor Red
    exit
}

# 2. Construcción de la imagen Docker
Write-Host "🏗️ Paso 2: Construyendo imagen Docker (Limpia y sin Caché)..." -ForegroundColor Yellow
docker build --no-cache `
    --build-arg VITE_API_URL=$API_URL `
    --build-arg VITE_API_BASE_URL=$API_URL `
    -t $REGISTRY.azurecr.io/$IMAGE_NAME:latest .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error en docker build." -ForegroundColor Red
    exit
}

# 3. Push de la imagen
Write-Host "📤 Paso 3: Subiendo imagen al Registry..." -ForegroundColor Yellow
docker push $REGISTRY.azurecr.io/$IMAGE_NAME:latest
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error en docker push." -ForegroundColor Red
    exit
}

# 4. Gestión de la Web App
Write-Host "🔍 Paso 4: Validando estado de Web App $APP_NAME..." -ForegroundColor Yellow
$APP_EXISTS = az webapp list --query "[?name=='$APP_NAME'].name" -o tsv

if (-not $APP_EXISTS) {
    Write-Host "🏗️ Creando la Web App por primera vez..." -ForegroundColor Yellow
    az webapp create `
        --resource-group $RG `
        --plan $PLAN `
        --name $APP_NAME `
        --deployment-container-image-name $REGISTRY.azurecr.io/$IMAGE_NAME:latest
}

# 5. Configuración de Entorno y Permisos
Write-Host "⚙️ Paso 5: Configurando App Settings y Managed Identity..." -ForegroundColor Yellow

$PRINCIPAL_ID = az webapp identity assign --name $APP_NAME --resource-group $RG --query principalId -o tsv
$ACR_ID = az acr show --name $REGISTRY --resource-group $RG --query id -o tsv

Write-Host "🔓 Asignando permisos AcrPull a la Web App..." -ForegroundColor Yellow
az role assignment create `
    --assignee $PRINCIPAL_ID `
    --scope $ACR_ID `
    --role "AcrPull" 2>$null

az webapp config appsettings set --resource-group $RG --name $APP_NAME --settings `
    WEBSITES_PORT=80 `
    DOCKER_REGISTRY_SERVER_URL="https://$REGISTRY.azurecr.io" `
    DOCKER_ENABLE_CI=true

az webapp config container set `
    --name $APP_NAME `
    --resource-group $RG `
	--docker-custom-image-name "$REGISTRY.azurecr.io/$IMAGE_NAME:latest" `
	--docker-registry-server-url "https://$REGISTRY.azurecr.io"

# 6. Finalización
Write-Host "🔄 Paso 6: Reiniciando Web App para aplicar cambios..." -ForegroundColor Yellow
az webapp restart --name $APP_NAME --resource-group $RG

$DOMAIN = az webapp show --name $APP_NAME --resource-group $RG --query defaultHostName -o tsv
Write-Host "✅ ¡Frontend desplegado con éxito!" -ForegroundColor Green
Write-Host "🔗 URL: https://$DOMAIN" -ForegroundColor Blue
