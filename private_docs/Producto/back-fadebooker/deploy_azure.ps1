# 🎭 FadeBooker - Script de Despliegue para Windows (PowerShell)
Write-Host "🚀 Iniciando el proceso de despliegue de FadeBooker en Windows..." -ForegroundColor Blue

# 1. Autenticación en Azure Container Registry
Write-Host "🔑 Paso 1: Iniciando sesión en Azure Container Registry..." -ForegroundColor Yellow
az acr login --name fadebookerregistry
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al autenticar en el registro." -ForegroundColor Red
    exit
}

# 2. Construcción de la imagen Docker
Write-Host "🏗️ Paso 2: Construyendo la imagen Docker..." -ForegroundColor Yellow
docker build --no-cache -t fadebookerregistry.azurecr.io/fadebooker-backend:latest .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error durante la construcción de la imagen." -ForegroundColor Red
    exit
}

# 3. Push de la imagen a la nube
Write-Host "📤 Paso 3: Subiendo imagen al registro de Azure..." -ForegroundColor Yellow
docker push fadebookerregistry.azurecr.io/fadebooker-backend:latest
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al subir la imagen." -ForegroundColor Red
    exit
}

# 4. Configuración de Variables de Entorno
Write-Host "⚙️ Paso 4: Sincronizando configuración en Azure..." -ForegroundColor Yellow
az webapp config appsettings set --name fadebooker-backend-ok --resource-group FadeBooker --settings `
  EMAIL_HOST="smtp.gmail.com" `
  EMAIL_PORT="587" `
  EMAIL_USER="fadebooker@gmail.com" `
  EMAIL_PASS="swuzpmvoftysdgss" `
  EMAIL_SECURE="false" `
  FRONTEND_URL="https://fadebooker.azurewebsites.net" `
  BACKEND_URL="https://fadebooker-backend-ok.azurewebsites.net" `
  MP_PUBLIC_KEY="TEST-0e031eb2-170a-4392-948f-f31b9bedc7a6" `
  MP_ACCESS_TOKEN="TEST-5665486996902898-051416-609148471955da2954d129d9f4de93f2-1101313361"

# 5. Reinicio de la Web App
Write-Host "🔄 Paso 5: Reiniciando la Web App en Azure..." -ForegroundColor Yellow
az webapp restart --name fadebooker-backend-ok --resource-group FadeBooker

Write-Host "✅ ¡Despliegue completado con éxito!" -ForegroundColor Green
Write-Host "🔗 Endpoint: https://fadebooker-backend-ok.azurewebsites.net/api/health" -ForegroundColor Blue
