# 🚀 Quick Start - FadeBooker React + Power Pages

**Tiempo estimado:** 30 minutos  
**Nivel:** Principiante

---

## 📋 Antes de Empezar

Asegúrate de tener:
- ✅ Power Apps CLI instalado: `npm install -g @microsoft/powerplatform-cli`
- ✅ Git configurado
- ✅ Acceso a Power Platform Admin Center
- ✅ Backend ejecutándose: `npm start` (en `Producto/back-fadebooker/`)

---

## ⚡ 5 Pasos (30 minutos)

### PASO 1️⃣: Autenticarse (2 min)

```bash
# Terminal / PowerShell
cd "c:\Users\SanNi\OneDrive\Escritorio\Barberia\FadeBooker"

# Ejecutar comando de autenticación
pac auth create --environment 28237aaa-b826-ecc1-87ab-5a19fc954e19

# Te pedirá tu cuenta Microsoft
# ✅ Si ves "Connection created successfully" → listo
```

---

### PASO 2️⃣: Descargar Sitio (5 min)

```bash
# Descargar el sitio Power Pages
pac pages download \
  --path "./pages-fadebooker" \
  --webSiteId af0d9c93-8138-4034-91ec-18c60b7953d5 \
  --modelVersion 2 \
  --overwrite

# Espera a que termine (~30-60 segundos)
# ✅ Debería haber creado/actualizado la carpeta pages-fadebooker
```

---

### PASO 3️⃣: Verificar Estructura (2 min)

```bash
# Ver lo que se descargó
ls -R pages-fadebooker/fadebooker/web-files/

# Deberías ver:
# - api-service.js ← NUEVO (ya está en el repo)
# - bootstrap.min.css
# - theme.css
# - FadeBooker_Logo.jpg
```

---

### PASO 4️⃣: Editar Página de Búsqueda (15 min)

**Ubicación:** `pages-fadebooker/fadebooker/web-pages/búsqueda/pagecopy.aspx.yml`

**Busca esta línea:**
```yaml
adx_source: |
  <html>
```

**Reemplázala con:**
```yaml
adx_source: |
  <html>
    <head>
      <title>Búsqueda de Barberos</title>
    </head>
    <body>
      <!-- React Container -->
      <div id="react-root" style="padding: 20px;"></div>

      <!-- React & ReactDOM from CDN -->
      <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
      <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

      <!-- API Service -->
      <script src="/web-files/api-service.js"></script>

      <!-- SearchBarbers Component -->
      <script src="/web-files/react/components/SearchBarbers.js"></script>
    </body>
  </html>
```

---

### PASO 5️⃣: Subir Cambios (5 min)

```bash
# Subir a Power Pages
pac pages upload --path "./pages-fadebooker" --modelVersion 2

# Espera a que suba (~30-60 segundos)
# ✅ Debería ver: "Pages portal deployed successfully"
```

---

## ✅ Verificar que Funciona

### Opción A: En Navegador

```
1. Abre: https://fadebooker.powerappsportals.com/búsqueda/
2. Deberías ver:
   - Título: "Encontrar Barberos"
   - Una lista de barberos
   - Filtros de búsqueda
   - Botones "Ver Perfil" y "Reservar"
```

### Opción B: En Console (F12)

```javascript
// Presiona F12 en Power Pages
// Abre Console tab
// Ejecuta:

window.ApiService.getBarbers()
  .then(barberos => console.log('✅ Barberos:', barberos))
  .catch(err => console.error('❌ Error:', err))
```

---

## 🐛 Si Algo Falla

### Backend no conecta

```bash
# 1. Verificar que Backend esté corriendo
cd Producto/back-fadebooker
npm start

# 2. Probar endpoint manualmente
# En otra terminal:
curl http://localhost:3000/api/barberos

# 3. Si no responde, revisar:
# - Variables de entorno (.env)
# - Conexión a BD
```

### React no aparece en Power Pages

```javascript
// En Console (F12) de Power Pages:
// Ver si hay errores

console.error() // Ver errores rojos

// Verificar que archivos estén disponibles
fetch('/web-files/api-service.js')
  .then(r => r.ok ? '✅ api-service.js existe' : '❌ No existe')

fetch('/web-files/react/components/SearchBarbers.js')
  .then(r => r.ok ? '✅ SearchBarbers.js existe' : '❌ No existe')
```

### Autorización denegada (PAC)

```bash
# Limpiar y reintentar
pac auth clear
pac auth create --environment 28237aaa-b826-ecc1-87ab-5a19fc954e19

# O verificar permisos en:
# https://admin.powerplatform.microsoft.com/
```

---

## 📚 Documentación Completa

Después de que funcione, lee:

1. **[REACT_INTEGRATION_GUIDE.md](./REACT_INTEGRATION_GUIDE.md)**
   - Arquitectura completa
   - Todos los componentes
   - Plan de 6 semanas

2. **[CONFIGURACION_ENTORNOS.md](../CONFIGURACION_ENTORNOS.md)**
   - Setup detallado
   - Todos los comandos
   - Troubleshooting

3. **[pages-fadebooker/README.md](./README.md)**
   - Estructura del proyecto
   - Cómo trabajar con Git
   - Workflow completo

---

## 🎯 Próximos Pasos

**Después de que SearchBarbers funcione:**

1. **Crear BookingForm.jsx**
   - Integrar en `/reserva-cita/`

2. **Crear UserProfile.jsx**
   - Integrar en `/mi-cuenta/`

3. **Crear ReviewCard.jsx**
   - Integrar en `/reseñas/`

---

## 📞 Cheat Sheet de Comandos

```bash
# Autenticación
pac auth create --environment 28237aaa-b826-ecc1-87ab-5a19fc954e19
pac auth list
pac auth clear

# Descarga
pac pages download --path "./pages-fadebooker" \
  --webSiteId af0d9c93-8138-4034-91ec-18c60b7953d5 \
  --modelVersion 2 --overwrite

# Upload
pac pages upload --path "./pages-fadebooker" --modelVersion 2

# Git
git status
git add .
git commit -m "feat: Agregar SearchBarbers"
git push
```

---

## ✨ Success Criteria

✅ **Phase 1 Complete cuando:**
- [ ] Backend está corriendo (`npm start`)
- [ ] PAC CLI autenticado (`pac auth show`)
- [ ] Sitio descargado (`pages-fadebooker/` tiene archivos)
- [ ] api-service.js existe en web-files
- [ ] SearchBarbers.js existe en web-files/react/components
- [ ] Página de búsqueda editada con HTML
- [ ] Cambios subidos (`pac pages upload`)
- [ ] Se ve en navegador: https://fadebooker.powerappsportals.com/búsqueda/
- [ ] Console sin errores (F12)
- [ ] `window.ApiService.getBarbers()` retorna datos

---

**¿Listo? ¡Comienza con PASO 1! 🚀**

