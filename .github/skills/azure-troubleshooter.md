# 🛠️ Skill: Azure Troubleshooter (FadeBooker)

Proceso especializado para diagnosticar y recuperar el Backend de FadeBooker en Azure App Service (Entorno Linux/Docker).

## 📋 Contexto del Entorno
- **App Service:** `fadebooker-backend-ok`
- **Resource Group:** `FadeBooker`
- **Container Registry:** `fadebookerregistry.azurecr.io`
- **Puerto Interno:** `3000` (WEBSITES_PORT)

## 🔄 Flujo de Diagnóstico (Paso a Paso)

### 1. Verificación de Logs en Tiempo Real
Si el backend devuelve "Application Error", lo primero es identificar el mensaje de error de Node.js.
```bash
az webapp log tail --name fadebooker-backend-ok --resource-group FadeBooker
```
*   **Check:** Buscar errores tipo `MODULE_NOT_FOUND` o `Cannot find module`.
*   **Check:** Verificar si hay errores de case-sensitivity (ej. `infraestructure` vs `infrastructure`).

### 2. Auditoría de Variables de Entorno (Secrets)
Muchos fallos ocurren porque las variables de entorno se pierden o están vacías en la consola.
```bash
az webapp config appsettings list --name fadebooker-backend-ok --resource-group FadeBooker --query "[].{Name:name, Value:value}" --output table
```
*   **Check:** `DOCKER_REGISTRY_SERVER_PASSWORD` debe tener valor. Si está vacío, recuperarlo con:
    ```bash
    az acr credential show --name fadebookerregistry --query "passwords[0].value" -o tsv
    ```

### 3. Recuperación de Conectividad ACR
Si el log indica "Unauthorized" (401), Azure no puede descargar la imagen.
```bash
ACR_PASS=$(az acr credential show --name fadebookerregistry --query "passwords[0].value" -o tsv)
az webapp config appsettings set --name fadebooker-backend-ok --resource-group FadeBooker --settings DOCKER_REGISTRY_SERVER_PASSWORD="$ACR_PASS"
```

### 4. Forzar Re-despliegue
Para asegurar que Azure use el código más reciente de GitHub después de un fix:
```bash
# Forzar descarga de imagen
az webapp config container set --name fadebooker-backend-ok --resource-group FadeBooker --container-image-name fadebookerregistry.azurecr.io/fadebooker-backend:latest

# Forzar construcción de dependencias
az webapp config appsettings set --name fadebooker-backend-ok --resource-group FadeBooker --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true

# Reinicio final
az webapp restart --name fadebooker-backend-ok --resource-group FadeBooker
```

## ⚠️ Pitfalls Comunes (Lecciones Aprendidas)
- **Linux Case-Sensitivity:** Asegurar que los `require()` coincidan exactamente con los nombres de archivos y carpetas (ej. `GenerarReporteCitas.js`).
- **SQL Server Dates:** Usar `CAST(fecha AS DATE)` en Knex para evitar errores de conversión en Azure SQL.
- **Null values in CLI:** Si la CLI devuelve `null` en los valores, verificar manualmente en el Portal de Azure (Variables de Entorno).

## 🎯 Ejemplo de Prompts para usar esta Skill
- "Ejecuta el diagnóstico de Azure Troubleshooter porque el backend da error 503."
- "Revisa si las credenciales del ACR en el App Service están sincronizadas."
- "Repara el error de 'Module not found' en el despliegue de Azure."
