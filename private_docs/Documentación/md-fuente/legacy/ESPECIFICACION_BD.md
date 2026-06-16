# 🗄️ FadeBooker - Especificación de Base de Datos (3NF)

**Versión:** 1.0.0  
**Fecha:** 14 de abril de 2026  
**Estado:** ✅ Script SQL + Diagrama ER completados

---

## 📦 Archivos Generados

### 1. **FadeBooker_ScriptBD.sql** (1000+ líneas)
Ubicación: `Documentación/Documentos/FadeBooker_ScriptBD.sql`

Contiene:
- ✅ **8 Tablas Base**: Usuario, Tienda, Barbero, Servicio, ServicioTienda, Cita, Pago, Reseña
- ✅ **2 Tablas de Auditoría**: AuditoriaPreciosServicio, AuditoriaCancelacion
- ✅ **13 Índices**: Optimizados para queries comunes
- ✅ **3 Vistas**: CitasProximas, CalificacionesBarbero, VentasPorTienda
- ✅ **3 Funciones UDF**: CalcularVentasBarbero, HorariosDisponibles, VerificarDisponibilidad
- ✅ **3 Stored Procedures**: AgendarCita, CancelarCita, ReporteVentasTienda
- ✅ **4 Triggers**: Validación, auditoría, actualización de calificaciones

### 2. **FadeBooker_ER_3NF.drawio** (Diagrama interactivo)
Ubicación: `Documentación/Material complementario/FadeBooker_ER_3NF.drawio`

Características:
- 📐 Diagrama ER visual en formato draw.io
- 🔗 Todas las relaciones 1:N y N:N representadas
- 🎨 Código de colores por tipo de tabla
- 📝 PKs, FKs y campos detallados por tabla
- 📋 Leyenda de normalización 3NF

**Para abrir:** Copiar a [draw.io](https://app.diagrams.net) o abrir con VS Code

### 3. **BD_Diseño_3NF.txt** (Documentación completa)
Ubicación: `Documentación/Documentos/BD_Diseño_3NF.txt`

Secciones:
- 📌 Resumen ejecutivo de la solución
- 🔄 Explicación detallada de normalización 3NF
- 📊 Estructura de todas las tablas
- 🔗 Relaciones y cardinalidades
- ⚡ Estrategia de índices
- 🛠️ Objetos de BD (SPs, funciones, triggers)
- 🚀 Pasos de implementación

---

## ✨ Puntos Clave

### Normalización a 3NF
- **1NF**: Todos atributos atómicos (sin multivalores)
- **2NF**: Sin dependencias parciales
- **3NF**: Sin dependencias transitivas
- ✅ **Cumplimiento total** + 1 excepción deliberada (id_tienda en Cita para performance)

### Arquitectura Robusta
- 🔐 **Integridad referencial** con Foreign Keys
- ✔️ **Validaciones** en Constraints y Triggers
- 📝 **Auditoría completa** de cambios
- ⚡ **Índices optimizados** para queries críticas
- 🔄 **Transacciones ACID** en SPs

### Funcionalidades Clave
- 🎯 **Agendar citas** con validación automática de disponibilidad
- 💰 **Gestión de pagos** (abono + saldo)
- ⭐ **Sistema de calificaciones** para barberos y tiendas
- 📊 **Reportes de ventas** por tienda y barbero
- 🚫 **Auditoría de cancelaciones** con reembolsos

---

## 🗂️ Diagrama de Relaciones

```
┌─────────┐
│ Usuario │─────────┐
└─────────┘         │
    │               │
    ├─→ Tienda ────→ ServicioTienda ← Servicio
    │       │            │
    ├─→ Barbero ─────────│
    │       │            │
    └─→ Cita ◄───────────┘
            ├─→ Pago
            └─→ Reseña
                ├─→ Auditoría Precios
                └─→ Auditoría Cancelación
```

---

## 🚀 Próximos Pasos

1. **Crear datos de prueba**
   ```sql
   -- Crear: FadeBooker_DatosTest.sql
   INSERT INTO Usuario (email, nombre, rol) VALUES ...
   INSERT INTO Tienda (nombre_tienda, id_dueño) VALUES ...
   ```

2. **Ejecutar script en SQL Server**
   ```sql
   USE FadeBooker_DB;
   GO
   EXEC sp_executesql N'...'  -- Contenido de FadeBooker_ScriptBD.sql
   ```

3. **Validar integridad**
   ```sql
   DBCC CHECKDB (FadeBooker_DB);
   SELECT * FROM sys.foreign_keys;
   ```

4. **Generar API Backend**
   ```
   @backend-agent: Crea endpoints REST basados en DB schema
   ```

5. **Documentar APIs**
   ```
   @documentation-agent: Documenta endpoints en OpenAPI/Swagger
   ```

---

## 📋 Especificaciones Técnicas

| Aspecto | Detalles |
|---------|----------|
| **Motor BD** | SQL Server 2019+ |
| **Servidor** | fadebooker-server.database.windows.net |
| **Base de Datos** | FadeBooker_DB |
| **Normalización** | 3NF (Tercera Forma Normal) |
| **Tablas** | 10 (8 operacionales + 2 auditoría) |
| **Índices** | 13 (optimizados para lectura) |
| **SPs** | 3 (procedimientos principales) |
| **Funciones** | 3 (lógica reutilizable) |
| **Triggers** | 4 (validación y auditoría) |
| **Vistas** | 3 (reportes) |

---

## 🎯 Cobertura de Dominio

✅ **Entidades principales de barbería:**
- Usuarios (Clientes, Barberos, Dueños)
- Tiendas (sucursales)
- Barberos (profesionales)
- Servicios (corte, barba, coloración, etc.)
- Citas (reservas)
- Pagos
- Calificaciones

✅ **Procesos de negocio:**
- Agendamiento de citas
- Verificación de disponibilidad
- Gestión de pagos (abono + saldo)
- Sistema de calificaciones
- Reportes de ventas
- Auditoría de cambios

✅ **Características de seguridad:**
- Constraints de integridad
- Validaciones en Triggers
- Auditoría de precios
- Auditoría de cancelaciones
- Transacciones ACID

---

## 📚 Documentación Relacionada

- `.github/copilot-instructions.md` - Visión del proyecto
- `.github/agents/database-agent.md` - Instrucciones del Database Agent
- `Documentación/README.md` - Overview del proyecto (crear)
- `Documentación/Documentos/Diccionario de Datos.xlsx` - Referencia original

---

**Status:** ✅ Diseño completado  
**Siguiente:** Backend Implementation (Node.js/TypeScript con Prisma)

