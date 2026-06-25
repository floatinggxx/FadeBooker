# start-local-docker.ps1
# Script de PowerShell para levantar localmente el frontend y backend de FadeBooker usando Docker Compose en Windows.

Write-Host "=== Iniciando Entorno Docker Local de FadeBooker ===" -ForegroundColor Cyan

# 1. Verificar si Docker está instalado
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "Docker no está instalado en este sistema o no se encuentra en el PATH."
    Exit 1
}

# 2. Verificar disponibilidad de Docker Compose
$DockerComposeCmd = ""
if (docker compose version *>$null) {
    $DockerComposeCmd = "docker compose"
} elseif (Get-Command docker-compose -ErrorAction SilentlyContinue) {
    $DockerComposeCmd = "docker-compose"
} else {
    Write-Error "Docker Compose no está instalado ni disponible como comando/plugin."
    Exit 1
}

Write-Host "Docker y Compose detectados correctamente. Usando: $DockerComposeCmd`n" -ForegroundColor Green

# Definir ruta raíz del proyecto
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

# 3. Validar archivo .env del backend
$backendEnvPath = Join-Path $root "Producto\back-fadebooker\.env"
$rootEnvPath = Join-Path $root ".env"
$backendEnvExamplePath = Join-Path $root "Producto\back-fadebooker\.env.example"

if (-not (Test-Path $backendEnvPath)) {
    if (Test-Path $rootEnvPath) {
        Write-Host "No se encontró Producto/back-fadebooker/.env, pero sí se encontró .env en la raíz." -ForegroundColor Yellow
        Write-Host "Copiando .env raíz a Producto/back-fadebooker/.env para Docker Compose..." -ForegroundColor Yellow
        Copy-Item $rootEnvPath $backendEnvPath -Force
    } elseif (Test-Path $backendEnvExamplePath) {
        Write-Host "No se encontró Producto/back-fadebooker/.env. Creando una copia de .env.example..." -ForegroundColor Yellow
        Copy-Item $backendEnvExamplePath $backendEnvPath -Force
        Write-Host "Por favor completa los valores en Producto/back-fadebooker/.env antes de volver a ejecutar." -ForegroundColor Red
        Exit 1
    } else {
        Write-Error "No se encontró .env en Producto/back-fadebooker ni .env en la raíz ni .env.example en Producto/back-fadebooker."
        Exit 1
    }
}

# 4. Limpiar contenedores previos
Write-Host "Limpiando contenedores antiguos si existen..." -ForegroundColor Yellow
Invoke-Expression "$DockerComposeCmd down"

# 5. Construir y levantar
Write-Host "Compilando imágenes y levantando servicios..." -ForegroundColor Yellow
Invoke-Expression "$DockerComposeCmd up --build -d"

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n=== ¡Entorno listo e iniciado con éxito! ===" -ForegroundColor Green
    Write-Host "Acceso al Frontend: http://localhost:8080" -ForegroundColor Blue
    Write-Host "Acceso al Backend:  http://localhost:3000" -ForegroundColor Blue
    Write-Host "`nPara ver los logs en tiempo real, ejecuta:"
    Write-Host "   $DockerComposeCmd logs -f" -ForegroundColor Cyan
    Write-Host "`nPara apagar el entorno, ejecuta:"
    Write-Host "   $DockerComposeCmd down`n" -ForegroundColor Cyan
} else {
    Write-Error "Hubo un problema al levantar los contenedores de Docker."
    Exit 1
}
