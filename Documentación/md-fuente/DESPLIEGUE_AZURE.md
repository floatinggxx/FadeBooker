# 🚀 Proceso de Despliegue en la Nube (Azure) - FadeBooker

Este documento describe el proceso técnico seguido para desplegar la base de datos y el backend de FadeBooker en Microsoft Azure.

---

## 💾 1. Despliegue de Base de Datos (SQL Server)

Para la migración de la base de datos desde el entorno local a Azure SQL Database, se utilizó el método de empaquetado de aplicaciones de capa de datos.

### Pasos realizados:
1.  **Generación de Paquete:** Se utilizó SQL Server Management Studio (SSMS) o Azure Data Studio para generar un archivo con extensión `.pac` (DACPAC) que contiene tanto el esquema (tablas, índices, triggers) como la lógica de la base de datos.
2.  **Importación en Azure:** 
    *   Se creó un recurso de **Azure SQL Server** (`fadebooker-server`).
    *   Se utilizó la función "Import Data-tier Application" para subir el archivo `.pac`.
3.  **Configuración de Seguridad:**
    *   Se habilitó el firewall para permitir acceso desde servicios de Azure (indispensable para que el backend se conecte).
    *   Se configuraron excepciones para las IPs locales de desarrollo.

---

## ⚙️ 2. Despliegue de Backend (Node.js + Docker)

El backend se desplegó utilizando una arquitectura basada en contenedores bajo el servicio **Azure App Service (Web App for Containers)**, tras identificar que las *Function Apps* no soportan servidores Express persistentes de forma nativa.

### Componentes de Infraestructura:
*   **Azure Container Registry (ACR):** `fadebookerregistry.azurecr.io` (Almacén de imágenes).
*   **App Service Plan:** `fadebooker-plan-v3` (Ubicado en **Brazil South**, SKU B1 Linux).
*   **Web App for Containers:** `fadebooker-backend-ok` (Recurso final validado).

### Flujo de Despliegue (Validado):
1.  **Dockerización:** Se utiliza `node:20-alpine`, exponiendo el puerto `3000`.
2.  **Configuración de Red (Crítica):**
    *   **Puerto:** Se debe configurar `WEBSITES_PORT=3000` y `PORT=3000` en App Settings.
    *   **Interfaces:** El servidor debe escuchar en `0.0.0.0` (configurado en `src/index.js`).
    *   **Arquitectura:** Se forzó el uso de **64-bit** (`use32BitWorkerProcess: false`) para compatibilidad con contenedores.
3.  **Configuración de Seguridad & DB:**
    *   **Firewall SQL:** Se habilitó "Allow Azure services" y se agregó la regla `AllowWebAppIP` para la IP de salida `191.235.228.39`.
    *   **Acceso ACR:** Se vinculó el registro mediante `az webapp config container set` con credenciales explícitas para evitar errores de pull.
4.  **Monitoreo:**
    *   **Endpoint:** `/api/health` devuelve estado operativo y entorno.
    *   **Logs:** Acceso vía `az webapp log tail`.

---

## 🛠️ 3. Comandos de Mantenimiento

### Actualizar Código (Pipeline Manual):
```bash
# 1. Entrar a la carpeta del backend
cd Producto/back-fadebooker

# 2. Construir la imagen con el nombre correcto de Azure
docker build -t fadebookerregistry.azurecr.io/fadebooker-backend:latest .

# 3. Iniciar sesión en el ACR
az acr login --name fadebookerregistry

# 4. Subir la imagen corregida
docker push fadebookerregistry.azurecr.io/fadebooker-backend:latest

# 5. Reiniciar el servicio para aplicar cambios
az webapp restart --name fadebooker-backend-ok --resource-group FadeBooker
```

### Gestión de Variables (App Settings):
```bash
# Ver valores actuales en formato tabla
az webapp config appsettings list --name fadebooker-backend-ok --resource-group FadeBooker --query "[].{Name:name, Value:value}" --output table
```

---

## 💡 4. Notas Técnicas de Último Minuto (Fixes)

### Error de Conversión de Fecha (Azure SQL)
Se detectó que el formato de fecha ISO-8601 causaba fallos en comparaciones directas en SQL Server. Se implementó un arreglo en `CitaRepositoryImpl.js` usando `CAST(fecha_hora_inicio AS DATE)` para garantizar compatibilidad total con MSSQL en Azure.

### Integración con Power Apps (Swagger)
Para el uso de Conectores Personalizados, se generó un `swagger.json` (v1.10.1) que expone:
- `POST /api/citas`: Agendamiento con validación de disponibilidad.
- `GET /api/barberos/{id}/servicios`: Listado de servicios específicos por barbero.
- **Autenticación:** Soporte para Bearer Token (Authorization Header).

---
**Última actualización:** 01 de mayo de 2026 (Fix: ACR Registry Name & SQL Date casting)
