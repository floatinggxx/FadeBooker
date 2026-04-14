# 🤖 AGENTS.md - Registro Central de Agentes FadeBooker

**Última actualización:** 14 de abril de 2026  
**Versión:** 1.0.0  
**Estado:** En desarrollo

---

## 📋 Descripción General

Este archivo es la **fuente única de verdad** para todos los agentes de FadeBooker. 

Cada agente tiene:
- ✅ Propósito claro
- ✅ Responsabilidades específicas
- ✅ Inputs/Outputs definidos
- ✅ Archivo de instrucciones personalizado en `.github/agents/`
- ✅ Ejemplos de uso

---

## 🎯 Agentes Activos

### 1️⃣ **Database Agent** 🗄️
**Propósito:** Crear, actualizar y mantener el esquema de la base de datos FadeBooker

**Responsabilidades:**
- Crear tablas, índices, constraints basados en el Diccionario de Datos
- Generar scripts de migración versionados (timestamp)
- Validar relaciones y integridad referencial
- Optimizar indexes y queries
- Mantener documentación de esquema

**Inputs:**
- Diccionario de Datos (Documentación/Documentos/)
- Diagrama ER (Documentación/Material complementario/)
- Requerimientos y Historias de Usuario
- Cambios/evoluciones del esquema

**Outputs:**
- Scripts SQL (carpeta `database/` en repositorio)
- Migraciones versionadas (`database/migrations/`)
- Validación de esquema
- Documentación de tablas y relaciones

**Instrucciones:** [`.github/agents/database-agent.md`](.github/agents/database-agent.md)

**Conexión BD:** `8db9ecf2-0e44-49d4-aaf3-8b00fe86a57b`

**Ejemplo de uso:**
```
@database-agent: Crear las tablas User, Photographer, Booking, Session basadas en el Diccionario de Datos. 
Incluir constraints de integridad referencial y índices por campos de búsqueda frecuente.
```

---

### 2️⃣ **Backend Agent** 🔧
**Propósito:** Generar código del backend, APIs y lógica de negocio

**Responsabilidades:**
- Crear estructura de carpetas (src/, controllers/, services/, models/)
- Generar endpoints RESTful basados en Historias Usuario
- Implementar servicios y lógica de negocio
- Crear modelos de datos (ORM/DTO)
- Documentar APIs con comentarios
- Seguir patrones de arquitectura limpia

**Inputs:**
- Histor ias de Usuario (Documentación/Documentos/)
- Requerimientos funcionales
- Esquema de BD (creado por Database Agent)
- Especificaciones de APIs

**Outputs:**
- Código del backend (carpeta `backend/` en repositorio)
- Modelos, servicios, controladores
- Comentarios y documentación inline
- Ejemplos de uso

**Instrucciones:** [`.github/agents/backend-agent.md`](.github/agents/backend-agent.md)

**Stack:** Node.js/JavaScript (backend actual en `Producto/back-fadebooker`)

**Ejemplo de uso:**
```
@backend-agent: Crear el servicio de BookingService que maneje la creación y gestión de reservas.
Incluir validaciones, transacciones y logs. Usar el esquema BD creado por Database Agent.
```

---

### 3️⃣ **Documentation Agent** 📋
**Propósito:** Crear y mantener documentación técnica y especificaciones

**Responsabilidades:**
- Crear README.md y guías de instalación
- Documentar APIs generadas (formato OpenAPI cuando corresponda)
- Mantener especificaciones de negocio
- Crear manuales de usuario
- Documentar procesos de deploy y testing
- Mantener CHANGELOG

**Inputs:**
- Código generado (Backend, BD)
- Especificaciones del producto
- Documentación existente
- Cambios en el proyecto

**Outputs:**
- README.md actualizado
- Guías de instalación y setup
- Documentación de APIs
- Manuales de usuario
- CHANGELOG.md

**Instrucciones:** [`.github/agents/documentation-agent.md`](.github/agents/documentation-agent.md)

**Ejemplo de uso:**
```
@documentation-agent: Crear README.md con instrucciones de instalación, estructura de proyecto 
y cómo ejecutar tests. Incluir links a Documentación/ existente.
```

---

### 4️⃣ **Diagram Agent** 📐
**Propósito:** Crear y mantener diagramas visuales usando draw.io

**Responsabilidades:**
- Convertir diagramas PDF a draw.io (ER, UML, Arquitectura)
- Mantener diagramas actualizados con cambios de código/BD
- Crear nuevos diagramas (flujos, componentes, secuencias)
- Exportar diagramas a PNG/SVG para documentación
- Versionear archivos `.drawio` en Git

**Inputs:**
- Diagramas existentes PDF (Documentación/Material complementario/)
- Cambios en esquema de BD o arquitectura
- Solicitudes de nuevos diagramas

**Outputs:**
- Archivos `.drawio` (carpeta `Documentación/diagramas/`)
- Versiones PNG/SVG para documentación
- Diagramas actualizados

**Instrucciones:** [`.github/agents/diagram-agent.md`](.github/agents/diagram-agent.md)

**Herramienta:** draw.io Integration extension en VS Code

**Ejemplo de uso:**
```
@diagram-agent: Convertir FadeBooker_Diagrama_ER.pdf a draw.io. Crear archivos .drawio 
para tablas User, Photographer, Booking con relaciones y cardinalidades.
```

---

### 5️⃣ **Orchestrator Agent** 🎛️
**Propósito:** Coordinar el flujo completo de desarrollo entre agentes

**Responsabilidades:**
- Dirigir ejecución secuencial de agentes
- Validar coherencia entre dominios (BD ↔ Backend ↔ Docs)
- Integrar cambios de múltiples agentes
- Reportar estado general del proyecto
- Resolver conflictos o inconsistencias

**Inputs:**
- Solicitudes de desarrollo completo
- Estado de cada agente
- Cambios en múltiples dominios

**Outputs:**
- Flujo de ejecución coordinado
- Validación de integridad
- Resumen de cambios integrados
- Reporte de estado

**Instrucciones:** [`.github/agents/orchestrator-agent.md`](.github/agents/orchestrator-agent.md)

## 📞 Coordinación Entre Agentes

### Database Agent → Backend Agent
- Database Agent crea esquema → Backend Agent usa esquema para generar modelos

### Backend Agent → Documentation Agent
- Backend Agent genera código → Documentation Agent documenta APIs

### Any Agent → Diagram Agent
- Cualquier cambio → Diagram Agent actualiza diagramas correspondientes

### Orchestrator Agent
- Coordina todo el flujo anterior

---

## 🚀 Cómo Usar Este Archivo

### Para invocar un agente:
```markdown
@nombre-agent: [descripción de tarea]
```

### Ejemplos:
```
@database-agent: Crear tabla de Users con campos id, email, nombre, createdAt
@backend-agent: Generar CRUD para Users en /users endpoint
@documentation-agent: Documentar endpoints de Users en README
@diagram-agent: Crear diagrama de flujo de autenticación
```

### Para comunicar cambios entre agentes:
- Actualizar este archivo (AGENTS.md)
- Especificar el estado del agente
- Documentar qué cambios afectarán a otros agentes

---

## 📊 Estado del Proyecto

| Agente | Estado | Completado | Próximos Pasos |
|--------|--------|-----------|-----------------|
| Database Agent | ✅ Listo | 0% | Crear esquema initial |
| Backend Agent | ✅ Listo | 0% | Generar estructura proyecto |
| Documentation Agent | ✅ Listo | 0% | Documentar APIs cuando estén creadas |
| Diagram Agent | ✅ Listo | 0% | Convertir PDFs a draw.io |
| Orchestrator Agent | ✅ Listo | 0% | Coordinar desarrollo completo |

---

## 🔗 Referencias Útiles

- **Instrucciones Globales:** [`copilot-instructions.md`](copilot-instructions.md)
- **Documentación Proyecto:** `Documentación/`
- **Conexión BD:** `fadebooker-server.database.windows.net / FadeBooker_DB`
- **Repositorio:** `c:\Users\Mauricio\Documents\GitHub\FadeBooker`

---

**Última actualización:** 14 de abril de 2026  
**Versión:** 1.0.0 (Inicial)
