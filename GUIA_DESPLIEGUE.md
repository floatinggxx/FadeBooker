## 🚀 Guía de Despliegue - Sección "Disponibilidad del Día"

### Requisitos Previos
- Node.js 20+
- SQL Server 2019+
- Acceso a la BD FadeBooker_DB
- Permisos de admin en el backend

---

## 📋 Pasos de Implementación

### PASO 1: Actualizar la Base de Datos

1. Abre SQL Server Management Studio (SSMS)
2. Conecta a: `fadebooker-server.database.windows.net`
3. Selecciona la BD: `FadeBooker_DB`
4. Abre un New Query y copia el contenido actualizado de:
   ```
   Documentación/Documentos/FadeBooker_ScriptBD.sql
   ```
5. Ejecuta el script completo (o solo la sección de BloqueHorario si ya tienes tablas)
   - Se creará la tabla `BloqueHorario`
   - Se creará el índice `IX_BloqueHorario_Barbero`

**Verificación:**
```sql
-- Ejecuta esto para confirmar que la tabla existe:
SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME='BloqueHorario'
-- Deberías ver una fila con BloqueHorario
```

---

### PASO 2: Actualizar el Backend

1. Navega a la carpeta del backend:
   ```bash
   cd Producto/back-fadebooker
   ```

2. Los siguientes archivos YA ESTÁN CREADOS en tu workspace:
   - `src/domain/repositories/bloqueHorario.repository.js`
   - `src/infraestructure/database/BloqueHorarioRepositoryImpl.js`
   - `src/application/usecases/bloqueHorario.service.js`
   - `src/interfaces/http/controllers/bloqueHorario.controller.js`
   - `src/interfaces/http/routes/bloqueHorario.routes.js`

3. Reinicia el servidor:
   ```bash
   npm install  # Por si hay cambios en dependencias
   npm start
   ```

4. Verifica que el servidor inicia sin errores:
   ```
   ✅ Servidor corriendo en puerto 3000
   ✅ Conectado a BD
   ```

5. Prueba el endpoint:
   ```bash
   curl http://localhost:3000/api/bloques/1/2026-06-10
   # Deberías obtener un array vacío [] si no hay bloques
   ```

---

### PASO 3: Actualizar el Frontend

1. Navega a la carpeta del frontend:
   ```bash
   cd Producto/front-fadebooker
   ```

2. Los siguientes archivos YA ESTÁN CREADOS:
   - `src/lib/api/availabilityService.ts`
   - `src/features/barbero/hooks/useDayAvailability.ts`
   - `src/features/barbero/ui/DayAvailability.tsx`
   - `src/features/barbero/ui/BlockTimeModal.tsx`
   - `src/features/barbero/ui/BarberoDashboard.tsx` (modificado)

3. Instala dependencias (si es necesario):
   ```bash
   npm install
   ```

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

5. Abre el navegador:
   ```
   http://localhost:5173
   ```

---

### PASO 4: Pruebas Manuales

#### 4.1 Acceder como Barbero

1. Inicia sesión como un usuario con rol **Barbero**
2. Deberías ver el Dashboard con las nuevas secciones
3. Verifica que NO está protegido (debe cargarse rápido)

#### 4.2 Probar la Disponibilidad del Día

1. **Sección visible:**
   - Entre las tarjetas de estadísticas (Ingresos, Servicios, Próxima Cita)
   - Y la sección "Agenda del Día"

2. **Componentes visibles:**
   - Selector de fecha (por defecto: hoy)
   - Grid de horarios (9:00 AM - 6:00 PM, intervalos de 30 min)
   - Leyenda con colores

#### 4.3 Probar Bloqueando un Horario

1. **Horarios Libres (Verde):**
   - Haz clic en un horario verde
   - Deberá abrirse el modal "Bloquear Horario"
   - Ingresa un motivo (ej: "Almuerzo")
   - Selecciona duración (ej: 60 minutos)
   - Haz clic en "Bloquear"
   - El horario debe cambiar a ROJO

2. **Verificar que se guardó:**
   - Actualiza la página (F5)
   - El bloqueo debe seguir ahí

#### 4.4 Probar Eliminando un Bloqueo

1. **Pasar mouse sobre un horario rojo:**
   - Deberá aparecer una "X" pequeña en la esquina superior derecha
   - Haz clic en la "X"
   - Confirma la eliminación
   - El horario debe volver a estar VERDE

#### 4.5 Probar Cambio de Fecha

1. **Cambiar a otra fecha:**
   - Usa el selector de fecha
   - El grid debe actualizarse automáticamente
   - Los bloques deben ser diferentes

#### 4.6 Verificar Citas Existentes

1. **Horarios Azules (Reservado):**
   - Si hay citas agendadas, sus horarios deben estar AZULES
   - NO debe ser posible hacer clic en ellos
   - No debe poder bloquearlos

---

### PASO 5: Verificación de Errores

**Si ves errores, verifica:**

1. **Error 404 en /bloques:**
   - Verificar que las rutas están registradas en `routes/index.js`
   - Reiniciar backend: `npm start`

2. **Error de base de datos:**
   - Verificar que la tabla `BloqueHorario` existe en SQL
   - Ejecutar: `SELECT * FROM BloqueHorario`

3. **Error en el modal:**
   - Verificar que `BlockTimeModal.tsx` se importa correctamente
   - Verificar que `useNotification` está disponible

4. **Bloques no se guardan:**
   - Verificar que el usuario está autenticado
   - Revisar la consola del navegador (F12 → Console)
   - Revisar los logs del backend

---

### PASO 6: Despliegue a Producción

Cuando todo funcione localmente:

1. **Commit a Git:**
   ```bash
   git add .
   git commit -m "feat: agregar sección Disponibilidad del Día"
   git push origin main
   ```

2. **Pipeline CI/CD:**
   - El Jenkinsfile ejecutará tests y build automáticamente
   - Si pasa, se desplegará a Azure

3. **Verificar en producción:**
   - Acceder a: `https://fadebooker.azurewebsites.net`
   - Probar con barbero real
   - Verificar en la BD que se crean los registros

---

## 📞 Soporte

Si encuentras problemas:

1. **Revisar los logs:**
   - Backend: Consola de `npm start`
   - Frontend: Browser DevTools (F12)
   - BD: Error logs en SSMS

2. **Puntos de verificación:**
   - ¿La tabla BloqueHorario existe?
   - ¿El backend está escuchando en puerto 3000?
   - ¿El frontend está en puerto 5173?
   - ¿El usuario está autenticado?

3. **Contactar:**
   - Revisar documentación en `/Documentación/md-fuente/`
   - Consultar al equipo de backend/DevOps

---

**Tiempo estimado:** 15-20 minutos  
**Dificultad:** Media  
**Riesgo:** Bajo (no modifica lógica existente)

✅ **¡Listo para producción!**
