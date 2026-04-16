# 🎨 Cloudinary - Simulación de Cortes

## 📋 Overview

Integración que permite a los clientes visualizar cómo se verían con diferentes cortes de pelo usando sus fotos e overlays de Cloudinary.

## 🔌 Endpoints

### 1. Obtener Firma para Subida Segura

```
POST /api/hairstyle/signature

Request:
{
  "folder": "user_photos"  // opcional, default: user_photos
}

Response (200):
{
  "success": true,
  "signature": "sha1_hash...",
  "timestamp": 1713283200,
  "cloudName": "tu_cloud",
  "apiKey": "api_key",
  "uploadPreset": "fadebooker_uploads",
  "folder": "user_photos"
}
```

**Propósito:** Generar firma SHA-1 que permite al frontend subir fotos a Cloudinary **sin exponer el API Secret del servidor**.

### 2. Simular Corte

```
POST /api/hairstyle/simulate

Request:
{
  "publicId": "user_photos/abc123",
  "styleId": "degradado"
}

Response (200):
{
  "success": true,
  "simulatedImageUrl": "https://res.cloudinary.com/.../degradado/user_photos/abc123.jpg",
  "styleId": "degradado",
  "publicId": "user_photos/abc123",
  "overlay": "cortes/degradado",
  "message": "Simulación de corte generada exitosamente"
}
```

**Propósito:** Generar URL transformada con overlay del corte aplicado a la foto del usuario.

## 🎨 Estilos Disponibles

| Estilo ID | Descripción | Overlay Path |
|-----------|-------------|--------------|
| `degradado` | Corte con degradado de lados | `cortes/degradado` |
| `clasico` | Corte clásico tradicional | `cortes/clasico` |
| `moderno` | Corte moderno contemporáneo | `cortes/moderno` |
| `mohicano` | Corte mohicano | `cortes/mohicano` |
| `buzzcut` | Corte rapado corto | `cortes/buzzcut` |

## 🔧 Configuración

### Archivos

1. **src/config/cloudinary.config.js**
   - Carga credenciales desde `.env`
   - Valida que estén presentes
   - Exporta objeto con config

2. **src/application/usecases/hairstyle.service.js**
   - `generateUploadSignature()` - Crea firma SHA-1
   - `generateHairstyleSimulation()` - Construye URL con overlay

3. **src/interfaces/http/controllers/hairstyle.controller.js**
   - Maneja requests HTTP
   - Valida parámetros
   - Responde JSON

4. **src/interfaces/http/routes/hairstyle.routes.js**
   - Define rutas POST
   - Delega a controllers

### Variables de Entorno

```env
CLOUDINARY_CLOUD_NAME=mi_cloud
CLOUDINARY_API_KEY=mi_key
CLOUDINARY_API_SECRET=mi_secret
CLOUDINARY_UPLOAD_PRESET=fadebooker_uploads
```

## 🔐 Seguridad

✅ **API Secret nunca se expone** - Solo se envía firma SHA-1  
✅ **Firma con Timestamp** - Previene replay attacks  
✅ **Validación de estilos** - Whitelist hardcodeada  
✅ **Error Handling** - Mensajes descriptivos sin exponer detalles  

## 💻 Cómo Usar (Frontend)

### 1. Obtener firma
```javascript
const sig = await fetch('http://localhost:3000/api/hairstyle/signature', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}).then(r => r.json());
```

### 2. Subir foto a Cloudinary
```javascript
const formData = new FormData();
formData.append('file', imageFile);
formData.append('upload_preset', sig.uploadPreset);
formData.append('signature', sig.signature);
formData.append('timestamp', sig.timestamp);
// ... más params

const result = await fetch(
  `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
  { method: 'POST', body: formData }
).then(r => r.json());

const publicId = result.public_id;
```

### 3. Simular corte
```javascript
const sim = await fetch('http://localhost:3000/api/hairstyle/simulate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ publicId, styleId: 'degradado' })
}).then(r => r.json());

// Renderizar imagen
<img src={sim.simulatedImageUrl} />
```

## 🧪 Testing

6+ tests unitarios en `tests/unit/hairstyle.service.test.js`

```bash
npm test hairstyle.service.test.js

# Casos cubiertos:
# ✅ Generación de firma
# ✅ Todos los estilos (degradado, clasico, etc)
# ✅ Validación de parámetros
# ✅ Manejo de errores
# ✅ Formato de respuestas
```

## 📊 Transformaciones Aplicadas

La URL generada incluye:

```
c_fill              # Crop fill (llenar espacio)
h_400               # Altura 400px
w_400               # Ancho 400px
g_faces             # Gravity: faces (centra en rostro)
q_auto              # Calidad automática
f_auto              # Formato automático
l_cortes:degradado  # Layer (overlay del corte)
fl_layer_apply      # Aplicar capa
```

## 🚀 Quick Start

```bash
# 1. Configura .env
cp .env.example .env
# Edita con credenciales de Cloudinary

# 2. Prueba endpoints
curl -X POST http://localhost:3000/api/hairstyle/signature \
  -H "Content-Type: application/json"

curl -X POST http://localhost:3000/api/hairstyle/simulate \
  -H "Content-Type: application/json" \
  -d '{"publicId":"test","styleId":"degradado"}'

# 3. Integra en frontend
# Ver FRONTEND_INTEGRATION_EXAMPLES.js para 6 tecnologías
```

## 📈 Casos de Uso

1. **Cliente preview** - Ver cómo se vería con diferente corte antes de ir
2. **Recomendación** - Barbero sugiere estilos basado en foto
3. **Gallery** - Marketing: mostrar antes/después
4. **Decision** - Cliente y barbero eligen juntos desde la app

## ⚠️ Limitaciones Actuales

- Overlays deben subirse manualmente a Cloudinary
- No hay ML para recomendaciones automáticas
- No hay caché de URLs generadas
- No hay analytics de estilos populares

## Últimos Cambios

- ✅ 2 endpoints implementados
- ✅ 5 estilos de corte
- ✅ Firma SHA-1 secure
- ✅ 6+ tests unitarios
- ✅ Documentación completa
