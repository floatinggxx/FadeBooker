# Script para arrancar backend con variables de entorno
Set-Location -Path 'C:\Users\Steve\Desktop\GitHub\FadeBooker\Producto\back-fadebooker'

# Establecer variables de entorno para esta sesión
$env:DB_SERVER = 'fadebooker-server-v2.database.windows.net'
$env:DB_NAME = 'FadeBooker_DB'
$env:DB_USER = 'adminuser'
$env:DB_PASSWORD = 'F4deBooker.2026'
$env:CLOUDINARY_CLOUD_NAME = 'fadebooker'
$env:CLOUDINARY_API_KEY = '267983583352493'
$env:CLOUDINARY_API_SECRET = 'yy5bfkweC0cJ9Gas8wX_5ItOPPI'
$env:PORT = '3000'

Write-Host "=== FadeBooker Backend Startup ===" -ForegroundColor Cyan
Write-Host "DB_SERVER: $($env:DB_SERVER)" -ForegroundColor Green
Write-Host "DB_NAME: $($env:DB_NAME)" -ForegroundColor Green
Write-Host "CLOUDINARY_CLOUD_NAME: $($env:CLOUDINARY_CLOUD_NAME)" -ForegroundColor Green
Write-Host "PORT: $($env:PORT)" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Cyan

npm start
