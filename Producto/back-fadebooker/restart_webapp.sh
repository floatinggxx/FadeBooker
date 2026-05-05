#!/bin/bash
# Script para intentar encontrar 'az' y reiniciar la webapp
AZ_PATH=$(which az 2>/dev/null || find /usr -name "az" -type f -executable 2>/dev/null | head -n 1)

if [ -z "$AZ_PATH" ]; then
    echo "ERROR: Azure CLI (az) no encontrado en /usr o el PATH."
    # Intentar ubicaciones comunes de Flatpak o extensiones de VS Code si aplica
    AZ_PATH=$(find /app -name "az" -type f -executable 2>/dev/null | head -n 1)
fi

if [ -n "$AZ_PATH" ]; then
    echo "Usando az en: $AZ_PATH"
    "$AZ_PATH" webapp restart --name fadebooker-backend-ok --resource-group FadeBooker
    sleep 5
    "$AZ_PATH" webapp log tail --name fadebooker-backend-ok --resource-group FadeBooker --num 50
else
    echo "No se pudo localizar el binario 'az'. Por favor, verifica el entorno de ejecución."
fi
