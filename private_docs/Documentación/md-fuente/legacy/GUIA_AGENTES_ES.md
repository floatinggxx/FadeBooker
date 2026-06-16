# 🤖 Guía de Uso de Agentes FadeBooker (ESPAÑOL)

## 📌 Introducción

Este documento explica cómo utilizar los agentes especializados de FadeBooker para desarrollo coordinado. Cada agente tiene un propósito específico y trabaja de forma coordinada con los demás.

**Versión:** 1.0.0  
**Última actualización:** 14 de abril de 2026  
**Idioma:** 🇪🇸 ESPAÑOL

---

## 🎯 Agentes Disponibles

### 1. Database Agent (Agente de Base de Datos)
**Responsable de:** Esquema BD, tablas, índices, migraciones

**Invocación:**
```markdown
@database-agent:
Crea tabla Reseña con campos:
- id_resena (PK, INT IDENTITY)
- id_cita (FK → Cita)
- id_usuario (FK → Usuario)
- calificacion (INT, 1-5)
- comentario (NVARCHAR(500))
- createdAt (DATETIME)

Incluye índices en id_cita, id_usuario, calificacion
```

**Responsabilidades:**
- ✅ Crear tablas nuevas
- ✅ Agregar columnas a tablas existentes
- ✅ Crear índices y constraints
- ✅ Definir relaciones (FK)
- ✅ Crear vistas si es necesario
- ✅ Migración de datos

**No hace:**
- ❌ Insertar datos (excepto seeds)
- ❌ Generar código backend
- ❌ Documentar APIs
- ❌ Crear diagramas

---

### 2. Backend Agent (Agente de Backend)
**Responsable de:** Endpoints, servicios, modelos, lógica de negocio

**Invocación:**
```markdown
@backend-agent:
Crea servicio y endpoints para Reseñas:

Servicios:
- crearResena(id_cita, id_usuario, calificacion, comentario)
- obtenerResenasDeCita(id_cita) → devuelve todas las reseñas
- obtenerCalificacionPromedio(id_barbero) → promedio

Endpoints:
- POST /api/resenas (crear reseña)
- GET /api/resenas/cita/:id (listar reseñas de cita)
- GET /api/barberos/:id/calificacion (calificación promedio)

Validaciones:
- Cita existe y está completada
- Usuario es quien hizo la cita
- Calificación entre 1 y 5
```

**Responsabilidades:**
- ✅ Crear endpoints REST (GET, POST, PUT, DELETE)
- ✅ Implementar servicios de negocio
- ✅ Crear/actualizar modelos de datos
- ✅ Validaciones de input
- ✅ Manejo de errores
- ✅ Tests unitarios
- ✅ Comentarios y documentación inline

**No hace:**
- ❌ Crear tablas BD (Database Agent)
- ❌ Documentación externa (Documentation Agent)
- ❌ Diagramas
- ❌ Deployment/DevOps

---

### 3. Documentation Agent (Agente de Documentación)
**Responsable de:** Documentación de APIs, guías, READMEs

**Invocación:**
```markdown
@documentation-agent:
Documenta endpoints de Reseñas en API_DOCUMENTATION.md:

POST /api/resenas
- Parámetros: id_cita, id_usuario, calificacion (1-5), comentario (max 500)
- Response: { id_resena, createdAt, estado }
- Errores: 404 (Cita no existe), 400 (Validación), 401 (No autenticado)
- Ejemplo de request y response

GET /api/resenas/cita/:id
- Parámetro: id_cita
- Response: Array de reseñas [ { id, calificacion, comentario, usuario } ]
- Incluye paginación (limit, offset)

Incluye también en GETTING_STARTED.md un flujo de ejemplo:
1. Usuario crea cita
2. Completa cita
3. Deja reseña
4. Barbero ve calificación
```

**Responsabilidades:**
- ✅ Documentar endpoints con ejemplos
- ✅ Crear guías de usuario (GETTING_STARTED.md)
- ✅ Documenta procesos de negocio
- ✅ Crea diagramas de flujo en texto (Mermaid)
- ✅ Mantiene README actualizado
- ✅ Documenta configuración

**No hace:**
- ❌ Generar código backend
- ❌ Crear tablas BD
- ❌ Diagramas visuales (Diagram Agent)
- ❌ Deployment

---

### 4. Diagram Agent (Agente de Diagramas)
**Responsable de:** Diagramas ER, UML, flujos de procesos

**Invocación:**
```markdown
@diagram-agent:
Actualiza diagrama ER agregando tabla Reseña:
- Tabla Reseña con colores azules
- FK: id_cita → Cita (línea sólida)
- FK: id_usuario → Usuario (línea sólida)
- Actualizar relación Barbero → Reseña (una línea a través de Cita)

Crea diagrama de flujo "Dejar Reseña" mostrando:
1. Usuario completa cita
2. Sistema solicita reseña
3. Usuario ingresa calificación (1-5)
4. Usuario ingresa comentario
5. Sistema valida
6. Se guarda en BD
7. Barbero recibe notificación
```

**Responsabilidades:**
- ✅ Actualizar diagrama ER (draw.io)
- ✅ Crear diagramas de clases (UML)
- ✅ Crear diagramas de flujo (procesos)
- ✅ Crear diagramas de secuencia
- ✅ Actualizar diagrama de arquitectura
- ✅ Exportar como PNG/SVG

**No hace:**
- ❌ Generar código
- ❌ Crear tablas
- ❌ Documentación escrita
- ❌ Deployment

---

### 5. Orchestrator Agent (Agente Coordinador)
**Responsable de:** Coordinación, validación, planificación

**Invocación:**
```markdown
@orchestrator-agent:
Coordina implementación completa de "Dejar Reseña":

FASE 1 - Database:
@database-agent: Crear tabla Reseña (ver especificación arriba)

FASE 2 - Backend:
@backend-agent: Crear servicios y endpoints (ver especificación arriba)

FASE 3 - Documentation:
@documentation-agent: Documentar API de Reseñas

FASE 4 - Diagrams:
@diagram-agent: Actualizar diagrama ER y crear flujo

FASE 5 - Validación:
Valida que:
- ✅ Tabla Reseña existe en BD
- ✅ Endpoints POST /api/resenas y GET /api/resenas/cita/:id funcionan
- ✅ Validaciones implementadas correctamente
- ✅ API documentada en API_DOCUMENTATION.md
- ✅ Diagrama ER actualizado con Reseña

Reporta cuando esté completado.
```

**Responsabilidades:**
- ✅ Coordinar flujo entre agentes
- ✅ Validar coherencia BD ↔ Backend ↔ Docs ↔ Diagramas
- ✅ Reportar estado y progreso
- ✅ Planificar sprints
- ✅ Resolver conflictos/inconsistencias
- ✅ Validar que checklist de "Feature Completa" se cumple

**No hace:**
- ❌ Implementar cambios directamente
- ❌ Crear código/tablas (otros agentes hacen eso)

---

## 📋 Patrones de Invocación

### Patrón 1: Crear Funcionalidad Completa

```markdown
@orchestrator-agent: [COMPLETE FLOW]

Quiero implementar: "Usuario puede ver disponibilidad de barberos"

Criterios:
- Barbero debe estar activo
- Mostrar horarios disponibles (sin solapamiento)
- Listar barberos por tienda
- Incluir calificación y años de experiencia

Coordina con todos los agentes en orden secuencial.
```

### Patrón 2: Solicitud Solo a un Agente

```markdown
@backend-agent:
Crea endpoint GET /api/barberos/:id/calificacion
que devuelve { id_barbero, calificacion_promedio, total_resenas }
```

### Patrón 3: Validación de Coherencia

```markdown
@orchestrator-agent: [VALIDATION]

Valida coherencia actual entre:
- BD: ¿Tabla Reseña existe con todos los campos?
- Backend: ¿Endpoints funcionan correctamente?
- Docs: ¿API está documentada?
- Diagramas: ¿ER incluye tabla nueva?

Reporta inconsistencias encontradas.
```

### Patrón 4: Reportar Estado

```markdown
@orchestrator-agent: [STATUS]

Reporta estado del proyecto:
- % completado general
- Tareas completadas esta semana
- Tareas en progreso
- Próximas tareas
- Cualquier blocker o problema
```

---

## ✅ Checklist para Funcionalidad Completa

Antes de declarar una funcionalidad como "COMPLETADA", verificar:

- [ ] **Database:** Tabla(s) creada(s) con todos los campos
- [ ] **Database:** Índices y constraints definidos
- [ ] **Database:** Relaciones (FK) correctas
- [ ] **Backend:** Servicios implementados con validaciones
- [ ] **Backend:** Endpoints CRUD (o aplicables) funcionan
- [ ] **Backend:** Manejo de errores apropiado (try/catch)
- [ ] **Backend:** Logs/auditoría si aplica
- [ ] **Documentation:** APIs documentadas con ejemplos
- [ ] **Documentation:** Flujo de negocio documentado
- [ ] **Diagrams:** Diagrama ER actualizado
- [ ] **Diagrams:** Diagrama de flujo de proceso (si aplica)
- [ ] **Tests:** Tests unitarios básicos
- [ ] **Validation:** Coherencia verificada entre dominios
- [ ] **Git:** Cambios commiteados con mensaje claro

---

## 🔄 Flujo Típico de Desarrollo

### Ejemplo: Implementar "Listar Barberos de Tienda"

**1. ESPECIFICACIÓN (Tú)**
```
Quiero que un usuario pueda ver todos los barberos de una tienda
específica con sus calificaciones, días de trabajo y horarios.
```

**2. DATABASE**
```markdown
@database-agent:
Revisar si tablas existentes (Barbero, Tienda, ServicioTienda) 
permiten esta consulta. Si es necesario, crear índices en 
Barbero.id_tienda y Barbero.activo para optimizar.
```

**3. BACKEND**
```markdown
@backend-agent:
GET /api/tiendas/:id/barberos
- Parámetro: id_tienda
- Query params: sortBy (calificacion|nombre), order (asc|desc)
- Response: Array de { id_barbero, nombre, apellido, foto, 
  calificacion, anos_experiencia, dias_laborales }
- Filtrar por barberos activos solamente
```

**4. DOCUMENTATION**
```markdown
@documentation-agent:
Documenta endpoint en API_DOCUMENTATION.md con:
- Descripción
- Parámetros
- Ejemplos de request/response
- Códigos de error posibles
- Incluir en GETTING_STARTED.md un ejemplo de flujo
```

**5. DIAGRAMS**
```markdown
@diagram-agent:
Actualiza diagrama de interacciones mostrando:
- Usuario → Sistema: Selecciona Tienda
- Sistema → BD: Lee Barbero, Tienda
- BD → Sistema: Retorna lista
- Sistema → Usuario: Muestra barberos
```

**6. VALIDACIÓN**
```markdown
@orchestrator-agent: [VALIDATION]
Valida que:
- Tabla Barbero tiene id_tienda y activo
- Endpoint retorna datos correctos
- Documentación incluye ejemplo
- Diagrama refleja flujo
```

---

## 📚 Ejemplos de Invocación Real

### Ejemplo 1: Crear Tabla Completa
```markdown
@orchestrator-agent:
Coordina creación de tabla "Disponibilidad" de barbero.

REQUIREMENTS:
- Registrar cada día el horario disponible
- Horario apertura y cierre
- Descanso (almuerzo, etc.)
- Citas ya reservadas
- Filtros por servicio (algunos barberos con servicios específicos)

Inicia con @database-agent, luego backend, docs y diagrams.
Reporta cuando esté completo.
```

### Ejemplo 2: Solo Backend
```markdown
@backend-agent:
Crea endpoints para búsqueda de barberos:

GET /api/barberos/buscar?nombre=Juan&especialidad=Corte
GET /api/barberos/mejores (ordenado por calificación)
GET /api/barberos/cercanos?lat=10.xxx&lon=20.xxx (geolocalización)

Incluye validaciones y manejo de errores.
```

### Ejemplo 3: Validación + Reporte
```markdown
@orchestrator-agent:
AUDIT: Valida coherencia completa del sistema y reporta:
1. ¿Todas las tablas documentadas en diccionario?
2. ¿Todos los endpoints en Swagger/Docs?
3. ¿Todos los diagramas actualizados?
4. ¿Posibles inconsistencias o deadlocks?

Proporciona recomendaciones para next sprint.
```

---

## 🎓 Mejores Prácticas

### ✅ DO's
- ✅ Sé específico en requests (incluye criterios, validaciones)
- ✅ Cita el formato esperado (JSON, SQL, Markdown)
- ✅ Incluye contexto relevante
- ✅ Usa checklist para validación
- ✅ Coordina a través de Orchestrator para cambios grandes
- ✅ Documenta decisiones de diseño

### ❌ DON'Ts
- ❌ No pidas a Database Agent que genere código
- ❌ No pidas a Backend Agent que cree tablas
- ❌ No hagas requests ambigüas
- ❌ No olvides validar coherencia antes de mergear
- ❌ No duplicar trabajo entre agentes

---

## 📞 Preguntas Frecuentes

**P: ¿Puedo invocar múltiples agentes simultáneamente?**  
R: Sí, pero solo si son independientes (ej: Backend y Diagramas). Database debe ser primero porque otros dependen de él.

**P: ¿Qué pasa si hay conflicto entre agentes?**  
R: El Orchestrator Agent lo detecta y reporta. Se resuelve manualmente o a través de re-coordinación.

**P: ¿Cómo sé si una funcionalidad está completa?**  
R: Usa el checklist incluido arriba. Orchestrator también puede validar.

**P: ¿Puedo cambiar el orden de invocación?**  
R: No para cambios grandes. Primero BD, luego Backend, luego Docs/Diagramas. Orchestrator coordina.

---

## 📞 Contacto

- **Documentación:** Consulta `.github/INSTRUCCIONES_GLOBALES_ES.md`
- **Agentes:** Consulta `.github/agents/`
- **Ejemplos:** Ver histórico de invocaciones en PRs/Issues

---

**Última actualización:** 14 de abril de 2026  
**Versión:** 1.0.0 (ESPAÑOL)  
**Idioma:** 🇪🇸 ESPAÑOL
