# [INIT] FadeBooker - Test Runner Centralizado para Windows (PowerShell)
Write-Host "[TEST] Iniciando ejecucion de pruebas unitarias - FadeBooker" -ForegroundColor Cyan

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

function Run-Test {
    param (
        [string]$Title,
        [string]$Command
    )
    Write-Host "`n[TEST] $Title" -ForegroundColor Yellow
    # Ejecutar comando y capturar exit code inmediatamente
    & cmd /c $Command 2>&1 | Out-Null
    $exitCode = $LASTEXITCODE
    
    if ($exitCode -eq 0) {
        Write-Host "[OK] Exito" -ForegroundColor Green
    } else {
        Write-Host "[FAILED] Fallo" -ForegroundColor Red
    }
    return $exitCode
}

# 1. Pruebas de Backend
Write-Host "`n[BACKEND] Ejecutando pruebas unitarias..." -ForegroundColor Blue
Set-Location "$root\Producto\back-fadebooker"
if (-Not (Test-Path "node_modules")) {
    Write-Host "[WARNING] node_modules no encontrado en backend. Ejecute 'npm install' primero." -ForegroundColor Yellow
    $backendResult = 1
} else {
    $backendResult = Run-Test "Backend - Pruebas unitarias" "npm run test:unit"
}

# 2. Pruebas de Frontend
Write-Host "`n[FRONTEND] Ejecutando pruebas unitarias..." -ForegroundColor Blue
Set-Location "$root\Producto\front-fadebooker"
if (-Not (Test-Path "node_modules")) {
    Write-Host "[WARNING] node_modules no encontrado en frontend. Ejecute 'npm install' primero." -ForegroundColor Yellow
    $frontendResult = 1
} else {
    $frontendResult = Run-Test "Frontend - Pruebas unitarias" "npm test"
}

# Resumen Final
Write-Host "`n=======================================" -ForegroundColor Blue
if ($backendResult -eq 0 -and $frontendResult -eq 0) {
    Write-Host "[SUCCESS] RESULTADO GLOBAL: TODO OK" -ForegroundColor Green
    exit 0
} else {
    Write-Host "[ERROR] RESULTADO GLOBAL: SE ENCONTRARON ERRORES" -ForegroundColor Red
    exit ($backendResult + $frontendResult)
}
