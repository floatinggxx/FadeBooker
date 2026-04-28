# 🚀 Referencia Rápida de Agentes FadeBooker

## 📋 Resumen de Agentes

| Agente | Especialidad | Comando | Cuándo Usar |
|--------|--------------|---------|-----------|
| 🗄️ **Database Agent** | Tablas, índices, FK | `@database-agent:` | Crear/modificar esquema BD |
| 💻 **Backend Agent** | APIs, servicios, modelos | `@backend-agent:` | Implementar endpoints y lógica |
| 📖 **Documentation Agent** | Docs, APIs, guías | `@documentation-agent:` | Documentar funcionalidad |
| 📊 **Diagram Agent** | ER, UML, flujos | `@diagram-agent:` | Actualizar diagramas |
| 🎛️ **Orchestrator Agent** | Coordinación, validación | `@orchestrator-agent:` | Orquestar todo junto |

---

## 📝 Templates de Invocación

### Database Agent
```markdown
@database-agent:
Crear tabla [NOMBRE] con:
- [CAMPOS CON TIPOS]
- [FK: TABLA REFERENCIA]
- [ÍNDICES SUGERIDOS]

Usa 3NF. Incluye timestamps (createdAt, updatedAt).
```

### Backend Agent
```markdown
@backend-agent:
Crear [SERVICIO/ENDPOINT]:
- Métodos: [LISTAR]
- Validaciones: [LISTAR]
- Manejo de errores: [ESPECIFICAR]

Sigue patrón de repositorio. Incluye comentarios.
```

### Documentation Agent
```markdown
@documentation-agent:
Documentar [CARACTERÍSTICAS] en:
- API_DOCUMENTATION.md
- Incluir ejemplos de request/response
- Incluir códigos de error
- Actualizar GETTING_STARTED.md si aplica
```

### Diagram Agent
```markdown
@diagram-agent:
Actualizar [TIPO DE DIAGRAMA]:
- Agregar/modificar: [ELEMENTOS]
- Relaciones: [LISTAR]
- Exportar como: PNG/SVG
```

### Orchestrator Agent
```markdown
@orchestrator-agent: [COMPLETE|VALIDATION|STATUS]

[DESCRIPCIÓN DE TAREA COMPLETA]

Coordina con otros agentes si es necesario.
```

---

## 🔥 Comandos Rápidos

### Crear Funcionalidad Completa
```markdown
@orchestrator-agent: [COMPLETE]
Implementar: [DESCRIPCIÓN]
Coordina Database → Backend → Documentation → Diagrams
```

### Validar Coherencia
```markdown
@orchestrator-agent: [VALIDATION]
Valida BD ↔ Backend ↔ Docs ↔ Diagramas
```

### Reportar Estado
```markdown
@orchestrator-agent: [STATUS]
Reporta progreso, completado, en progreso, próximo
```

### Corregir Solo Backend
```markdown
@backend-agent:
Corrige: [DESCRIBE EL PROBLEMA]
```

### documentar Solo API
```markdown
@documentation-agent:
Documenta endpoint: [NOMBRE]
Formato: [ESPECIFICAR]
```

---

## 📚 Ejemplos Reales

### ✅ Crear Tabla
```markdown
@database-agent:
Crear tabla Promocion:
- id_promocion (INT IDENTITY PRIMARY KEY)
- id_tienda (INT FK → Tienda)
- codigo (VARCHAR(50) UNIQUE)
- descripcion (NVARCHAR(500))
- porcentaje_descuento (DECIMAL(5,2))
- fecha_inicio (DATETIME)
- fecha_fin (DATETIME)
- activa (BIT DEFAULT 1)
- createdAt (DATETIME DEFAULT GETDATE())
- updatedAt (DATETIME DEFAULT GETDATE())

Índices: id_tienda, codigo, fecha_inicio
FK: id_tienda ON DELETE CASCADE
```

### ✅ Crear Endpoint
```markdown
@backend-agent:
Endpoint: POST /api/citas/:id/cancelar
Body: { motivo: string, ofrecerReembolso: boolean }
Validaciones:
- Cita existe
- Usuario propietario o admin
- Estado != 'completada' o 'cancelada'
Respuesta: { id_cita, estado: 'cancelada', timestamp }
Error: 404 (no existe), 403 (permisos), 400 (validación)
```

### ✅ Documentar API
```markdown
@documentation-agent:
Documenta en API_DOCUMENTATION.md:

### POST /api/citas/:id/cancelar
Cancela una cita

**Parámetro Path:**
- id (int): ID de cita

**Body:**
{ motivo: "string describiendo razón", 
  ofrecerReembolso: boolean }

**Respuesta (200):**
{ id_cita: 5, estado: 'cancelada', canceledAt: '2026-04-14T10:30:00Z' }

**Errores:**
- 404: Cita no encontrada
- 403: No tienes permiso
- 400: Estado de cita no permite cancelación
```

### ✅ Flujo Completo
```markdown
@orchestrator-agent: [COMPLETE]

Implementar: Sistema de Promociones

FASE 1 - Database:
@database-agent: Crear tabla Promocion (ver arriba)

FASE 2 - Backend:
@backend-agent: 
- GET /api/promociones (listar activas)
- POST /api/promociones (crear, solo admin)
- GET /api/promociones/codigo/:codigo (validar código)
- Servicio: aplicarPromocion(id_cita, codigo)

FASE 3 - Docs:
@documentation-agent: Documentar endpoints de Promociones

FASE 4 - Diagrams:
@diagram-agent: Actualizar ER con tabla Promocion

FASE 5: Validate
Ensure promociones can be applied at checkout,
discount is calculated correctly, audit trail exists
```

---

## ☑️ Checklist Pre-Push

Antes de hacer commit:

- [ ] Invoqué agentes en orden correcto (DB → Backend → Docs → Diagrams)
- [ ] Validé coherencia entre BD y Backend
- [ ] Documentación está actualizada
- [ ] Diagramas reflejan cambios
- [ ] Tests pasan (si aplica)
- [ ] Mensaje de commit es descriptivo
- [ ] Commit referencia issue si aplica

---

## 🎯 Propósito de Cada Agente

### Database Agent
```
Lo que HACE:
✅ Crea/modifica tablas
✅ Define relaciones (FK)
✅ Crea índices para performance
✅ Cumple 3NF
✅ Manejo de timestamps

Lo que NO hace:
❌ Inserta datos (excepto seeds)
❌ Genera código
❌ Escribe documentación
```

### Backend Agent
```
Lo que HACE:
✅ Endpoints REST
✅ Servicios de negocio
✅ Modelos/DTOs
✅ Validaciones
✅ Manejo de errores

Lo que NO hace:
❌ Crea tablas
❌ Documentación externa
❌ Diagramas
❌ DevOps/Deployment
```

### Documentation Agent
```
Lo que HACE:
✅ APIs document (ejemplos, parámetros)
✅ Guías de usuario (GETTING_STARTED)
✅ Procesos de negocio
✅ Diagramas de flujo (Mermaid)
✅ README actualizado

Lo que NO hace:
❌ Código
❌ Tablas
❌ Diagramas visuales (ER, UML)
```

### Diagram Agent
```
Lo que HACE:
✅ Diagrama ER
✅ Diagrama de Clases (UML)
✅ Diagramas de flujo
✅ Diagramas de secuencia
✅ Arquitectura general

Lo que NO hace:
❌ Código
❌ Tablas
❌ Documentación escrita
```

### Orchestrator Agent
```
Lo que HACE:
✅ Coordina flujo
✅ Valida coherencia
✅ Reporta estado
✅ Planifica sprints
✅ Resuelve conflictos

Lo que NO hace:
❌ Implementa código
❌ Crea tablas
❌ Escribe documentación directa
```

---

## 🔗 URLs Importantes

- **Instrucciones Globales:** `.github/INSTRUCCIONES_GLOBALES_ES.md`
- **Guía Completa:** `.github/GUIA_AGENTES_ES.md` (este archivo)
- **BD Especificación:** `Documentación/ESPECIFICACION_BD.md`
- **Conexión BD:** `fadebooker-server.database.windows.net / FadeBooker_DB`
- **Backend:** `Producto/back-fadebooker/`

---

## 💡 Tips Profesionales

**Cuando pidas cambios:**
1. Sé lo más específico posible
2. Incluye ejemplos/mockups
3. Define validaciones esperadas
4. Especifica formato de salida

**Para verificar trabajo:**
1. Usa Orchestrator Agent para validar coherencia
2. Lee los comentarios en el código
3. Verifica que documentación sea clara
4. Confirma que diagramas coincidan con implementación

**Para PR/Commits:**
```
feat: Implementar sistema de promociones
- Database: Tabla Promocion (3NF)
- Backend: Endpoints GET/POST/DELETE promociones
- API: Documentado con ejemplos
- Diagrams: ER actualizado
- Tests: 12 nuevos tests, coverage 85%
```

---

## 📞 Contacto

- **Issues:** GitHub Issues
- **Docs:** Carpeta `Documentación/`
- **Questions:** Revisar GUIA_AGENTES_ES.md

---

**Última actualización:** 14 de abril de 2026  
**Versión:** 1.0.0 (ESPAÑOL)  
🇪🇸 **ESPAÑOL**
