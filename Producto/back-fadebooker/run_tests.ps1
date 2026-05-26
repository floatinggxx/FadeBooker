# 🎭 FadeBooker - Suite de Pruebas para Windows (PowerShell)
Write-Host "🧪 Iniciando suite de validación de FadeBooker..." -ForegroundColor Cyan

function Run-Test {
    param (
        [string]$Title,
        [string]$Command
    )
    Write-Host "`n[TEST] $Title" -ForegroundColor Yellow
    Invoke-Expression $Command
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Éxito" -ForegroundColor Green
    } else {
        Write-Host "❌ Falló" -ForegroundColor Red
    }
}

# 1. Tests Unitarios (Jest)
Run-Test "Pruebas Unitarias (Lógica de Negocio)" "npm run test:unit"

# 2. Tests de Integración (API y DB)
Run-Test "Pruebas de Integración (API & Base de Datos)" "npm run test:integration"

# 3. Scripts de Validación Específicos
Write-Host "`n🧪 Ejecutando validaciones de servicios externos..." -ForegroundColor Blue

# Test Cloudinary (Si existe el archivo)
if (Test-Path "test_cloudinary.js") {
    Run-Test "Validación del Adaptador Cloudinary" "node test_cloudinary.js"
}

# Test Mercado Pago / Automate (Si existe el archivo)
if (Test-Path "test_automate_manual.js") {
    Run-Test "Validación de Flujo Manual / Pagos" "node test_automate_manual.js"
}

Write-Host "`n📊 Resumen de validación finalizado." -ForegroundColor Cyan
Write-Host "Si todos los bloques dicen ✅ Éxito, el sistema es estable para producción." -ForegroundColor Gray
