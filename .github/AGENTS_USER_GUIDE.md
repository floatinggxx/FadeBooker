# 📖 AGENTS USER GUIDE - Manual de Uso de Agentes FadeBooker

**Versión:** 1.0.0  
**Última actualización:** 14 de abril de 2026  
**Propósito:** Guía completa para usar los agentes de FadeBooker

---

## 🎯 Introducción

FadeBooker tiene **5 agentes especializados** que trabajan juntos para crear un proyecto de alta calidad:

| Agente | Especialidad | Símbolo |
|--------|--------------|---------|
| **Database Agent** | Base de Datos SQL Server | 🗄️ |
| **Backend Agent** | APIs y lógica de negocio | 🔧 |
| **Documentation Agent** | Documentación técnica | 📋 |
| **Diagram Agent** | Diagramas visuales (draw.io) | 📐 |
| **Orchestrator Agent** | Coordinación general | 🎛️ |

---

## 📚 Tabla de Contenidos

1. [Conceptos Básicos](#conceptos-básicos)
2. [Cómo Invocar Agentes](#cómo-invocar-agentes)
3. [Flujos de Trabajo](#flujos-de-trabajo)
4. [Ejemplos Prácticos](#ejemplos-prácticos)
5. [Mejores Prácticas](#mejores-prácticas)
6. [Troubleshooting](#troubleshooting)

---

## 🔑 Conceptos Básicos

### ¿Qué es un Agente?

Un agente es una **IA especializada** que:
- Lee instrucciones específicas (archivos en `.github/agents/`)
- Ejecuta tareas en su dominio (BD, Backend, Docs, etc.)
- Se comunica con otros agentes
- Mantiene estándares del proyecto

### Flujo de Comunicación

```
Tú (usuario)
    ↓
@nombreagente INVOCACIÓN
    ↓
Agente lee `.github/agents/nombreagente.md`
    ↓
Agente ejecuta tarea
    ↓
Agente entrega resultado (código, documentación, etc.)
    ↓
Otros agentes pueden usar el resultado
```

### Ciclo de Vida Típico

```
SOLICITUD → PROCESAMIENTO → ENTREGA → INTEGRACIÓN → VALIDACIÓN
```

---

## 🗣️ Cómo Invocar Agentes

### Sintaxis Básica

```markdown
@nombre-agent: [descripción de tarea]
```

### Ejemplos

**Simple:**
```
@database-agent: Crea tabla Users con id, email, firstName, lastName, createdAt
```

**Con detalles:**
```
@backend-agent: Crea servicio UserService con métodos:
- createUser(data: CreateUserDTO)
- getUserById(id: number)
- updateUser(id: number, data: UpdateUserDTO)
- deleteUser(id: number)

Incluye validaciones y manejo de errores.
```

**Multi-línea:**
```
@orchestrator-agent:
Coordina implementación de "Crear Reserva":

1. Database: Crea tabla Bookings
2. Backend: Endpoints POST, GET, PUT, DELETE /api/bookings
3. Documentation: Documenta en API_DOCUMENTATION.md
4. Diagram: Actualiza ER y flujo de proceso
5. Validate: Verifica coherencia
```

### Mejores Prácticas de Solicitud

✅ **Hacer:**
- Sé específico: "Crea tabla Users con campos..."
- Proporciona contexto: "Basado en Historia Usuario X..."
- Especifica formato: "En TypeScript, usando Prisma..."
- USA imperativos: "Crea", "Genera", "Actualiza"
- Referencia documentos: "Como especifica en Diccionario de Datos..."

❌ **No hacer:**
- Ser vago: "Haz algo de backend"
- Múltiples solicitudes mezcladas
- Pedir detalles no estructurados
- Cambiar requisitos a mitad de la tarea

---

## 🔄 Flujos de Trabajo

### Flujo 1: Implementación Secuencial (Defecto)

Para implementar **1 funcionalidad completa** de principio a fin.

```markdown
# Paso 1: Especificación
@database-agent: Crea tabla Barbero con:
- id_barbero (PK)
- id_usuario (FK → Usuario)
- especialidad, experiencia_anos, tarifa_base
- activo, createdAt, updatedAt

# Paso 2: Implementación Backend (después de Paso 1)
@backend-agent: Crea BarberService y endpoints:
- GET /api/barbers (listar)
- GET /api/barbers/:id (detalle)
- GET /api/barbers/:id/availability (disponibilidad)
- POST /api/barbers (registrar)
- PUT /api/barbers/:id (actualizar)
- DELETE /api/barbers/:id (desactivar)

# Paso 3: Documentación (después de Paso 2)
@documentation-agent: Documenta endpoints de Barbers en API_DOCUMENTATION.md

# Paso 4: Diagramas (después de Paso 3)
@diagram-agent: Actualiza diagrama ER agregando tabla Barbero con relaciones a Tienda y Usuario

# Paso 5: Validación (después de Paso 4)
@orchestrator-agent: Valida que Barberos está completamente implementada en:
- BD (tabla existe, campos correctos)
- Backend (endpoints funcionan)
- Docs (APIs documentadas)
- Diagrams (ER actualizado)
```

**Cuándo usar:** Desarrollo normal, una funcionalidad a la vez

---

### Flujo 2: Coordinación Completa (Recomendado)

Invoca **Orchestrator Agent** para que coordine todo de una vez.

```markdown
@orchestrator-agent: [COMPLETE]
Implementa Historia Usuario: "Como barbero, quiero poder registrarme en el sistema para ofrecer mis servicios"

Detalles:
- Usuario existente en BD
- Registrar como barbero = tabla Barbero linkedada a Usuario
- Campos: especialidad, años_experiencia, tarifa_base, foto_perfil, activo

Fase 1: Database Agent crea tabla Barbero
Fase 2: Backend Agent crea endpoints CRUD + validaciones
Fase 3: Documentation Agent documenta APIs
Fase 4: Diagram Agent actualiza ER
Fase 5: Validate y reporta estado
```

**Cuándo usar:** Funcionalidades complejas, desarrollo rápido, necesitas validación

---

### Flujo 3: Actualización de Documentación Únicamente

**Caso:** Ya existe código, solo necesitas documentar

```markdown
@documentation-agent: Los endpoints de Citas ya existen. Documenta en API_DOCUMENTATION.md:
- POST /api/bookings (agendar cita)
- GET /api/bookings/:id (obtener cita)
- GET /api/bookings (listar mis citas)
- PUT /api/bookings/:id (modificar cita)
- DELETE /api/bookings/:id (cancelar)

Incluye parámetros, responses y códigos de error.
```

**Cuándo usar:** Documentación atrasada, cambios menores, retrospectiva

---

### Flujo 4: Diagrama Inicial (Conversión de PDFs)

```markdown
@diagram-agent: Convierte los diagramas PDF existentes a draw.io:
1. FadeBooker_Diagrama_ER.pdf → ER_FadeBooker.drawio
2. FadeBooker_Diagrama_Clase.pdf → Classes_FadeBooker.drawio
3. FadeBooker_Diagrama_ActividadesUML.png → Activities_FadeBooker.drawio

Crea carpeta Documentación/diagramas/ e incluye archivos .drawio ahí.
Exporta a PNG para documentación.
```

**Cuándo usar:** Setup inicial, primera vez usando agentes

---

## 📝 Ejemplos Prácticos

### Ejemplo 1: Crear CRUD de Barbers (Barberos)

**Objetivo:** Implementación completa de Barberos (tabla + endpoints + docs + diagrama)

**Opción A: Manual (Paso a paso)**

```markdown
Paso 1: BD
@database-agent: Crea tabla Barbero basada en Diccionario de Datos con:
- id_barbero (PK), id_usuario (FK → Usuario), id_tienda (FK → Tienda)
- especialidad, foto_perfil_url, activo
- createdAt, updatedAt
Incluye validación de especialidad e índices en id_tienda.

Paso 2: Backend
@backend-agent: Crea BarberService y endpoints REST:
- GET /api/barbers (listar con paginación y filtros)
- GET /api/barbers/:id (obtener perfil completo)
- GET /api/barbers/:id/availability (horarios disponibles)
- POST /api/barbers (registrar barbero)
- PUT /api/barbers/:id (actualizar perfil)
- DELETE /api/barbers/:id (desactivar)

Paso 3: Docs
@documentation-agent: Documenta endpoints de Barbers en API_DOCUMENTATION.md

Paso 4: Diagrama
@diagram-agent: En diagrama ER, visualiza tabla Barbero con relaciones a Tienda y Usuario
```

**Opción B: Automática (Orchestrator)**

```markdown
@orchestrator-agent: [COMPLETE]
Implementa el CRUD completo de Barbers:
- Database: Tabla Barbero (id_barbero, id_usuario FK, id_tienda FK, especialidad, foto_perfil_url, timestamps)
- Backend: Endpoints REST CRUD + endpoint de disponibilidad
- Documentation: API docs
- Diagrams: Actualiza ER
- Validate: Verifica coherencia
```

---

### Ejemplo 2: Agendar Cita de Barbería

```markdown
@orchestrator-agent: [COMPLETE]
Implementa Historia de Usuario:
"Como cliente, quiero agendar una cita con un barbero para obtener el servicio que necesito"

Wireframe:
- Cliente selecciona barbero disponible
- Elige servicio (corte, barba, coloración, etc.)
- Elige fecha y hora (intervalos de 30 min según duración de servicio)
- Realiza abono/pago
- Recibe confirmación de la cita

Pasos:
1. @database-agent: Verifica tabla Cita con campos:
   - id_cita (PK), id_cliente (FK → Usuario), id_barbero (FK → Barbero)
   - id_servicio (FK → Servicio), id_tienda (FK → Tienda)
   - fecha_hora_inicio, duracion_minutos, estado (confirmada/cancelada)
   - monto_total, pago_abono, metodo_pago
   - createdAt, updatedAt
   - Índices en id_cliente, id_barbero, estado, fecha_hora_inicio

2. @backend-agent: Crea CitaService y endpoints
   - GET /api/barbers/:id/availability?date=YYYY-MM-DD (horarios libres)
   - POST /api/bookings (agendar cita)
   - GET /api/bookings/:id (obtener detalle)
   - GET /api/bookings (listar mis citas)
   - PUT /api/bookings/:id (modificar cita)
   - DELETE /api/bookings/:id (cancelar cita con reembolso)
   
   Validaciones:
   - Cliente existe
   - Barbero existe y está activo en la tienda
   - Servicio existe
   - Horario disponible (no hay otra cita solapada)
   - Abono >= monto mínimo requerido
   - Fecha/hora en futuro

3. @documentation-agent: Documenta endpoints en API_DOCUMENTATION.md

4. @diagram-agent: 
   - Actualiza ER con relaciones Cliente → Cita ← Barbero ← Servicio
   - Crea diagrama de flujo "Agendar Cita"
   - Crea diagrama de secuencia de la transacción

5. Validate coherencia BD ↔ Backend ↔ Docs ↔ Diagrams
```

---

### Ejemplo 3: Generar Reporte de Ventas por Tienda

```markdown
@orchestrator-agent: [COMPLETE]
Implementa Funcionalidad:
"Como dueño de tienda, quiero ver un reporte de ventas por barbero y período"

Dashboard Esperado:
- Ingresos totales por barbero
- Citas completadas vs canceladas
- Calificación promedio de barbero
- Período filtrable (hoy, semana, mes, rango personalizado)

Pasos:
1. @database-agent: 
   - Verifica índices en Pago(fecha_pago), Cita(estado, fecha_hora_inicio, id_barbero)
   - Evalúa crear vista SQL: vw_VentasPorBarbero
   - Procedure SQL: usp_ReporteVentasTienda

2. @backend-agent:
   - GET /api/reports/barbers/:id/sales?startDate=&endDate= (ventas por barbero)
   - GET /api/reports/barbers/:id/ratings (rating promedio)
   - GET /api/reports/tiendas/:id/summary?period=month (resumen de tienda)
   - GET /api/reports/tiendas/:id/top-performers (barberos con mejor desempeño)
   
   Lógica:
   - Sumar monto_total de citas completadas en período
   - Contar citas por estado
   - Calcular promedio de puntuaciones en reseñas
   - Filtrar por id_tienda del barbero

3. @documentation-agent:
   - Documenta endpoints de reportes
   - Incluye ejemplos de respuesta (JSON)
   - Explica cálculos realizados

4. @diagram-agent: 
   - Crea diagrama de relaciones para reportes
   - Incluye las tablas: Cita, Pago, Reseña, Barbero, Tienda

5. Validate coherencia
```

---

## ✅ Mejores Prácticas

### 1. Organización

**Hacer:**
- Una Historia Usuario = Un flujo completo (DB → Backend → Docs → Diagrams)
- Especificar orden de ejecución
- Validar después de completar

**No hacer:**
- Mezclar múltiples funcionalidades en un request
- Pedir cambios sin contexto
- Ignorar validaciones

### 2. Especificidad

**Bueno:**
```
@database-agent: Crea tabla Movies con campos:
- id (INT PK)
- title (nvarchar(200) NOT NULL)
- director (nvarchar(100))
- releaseYear (INT)
- createdAt (DATETIME2)
```

**Malo:**
```
@database-agent: Crea tabla Movies
```

### 3. Contexto

**Siempre proporciona:**
- Historia de Usuario que motiva el cambio
- Restricciones o requisitos especiales
- Documentos de referencia (Diccionario de Datos, etc.)
- Ejemplos si es necesario

```
@backend-agent: Implementa logica de validacion de reserva basada en
Historia Usuario "Crear Reserva" (Historias Usuario.xlsx, fila 5).
Restricciones:
- Fotógrafo debe estar activo
- Fecha debe ser > hoy
- Máximo 10 reservas por fotógrafo por día
```

### 4. Secuencialidad

**Orden correcto:**
```
1. Database (define estructura)
2. Backend (implementa)
3. Documentation (describe)
4. Diagrams (visualiza)
5. Orchestrator (valida)
```

**NO hagas:**
```
1. Backend primero (sin schema BD)
2. Diagramas antes de código (desincronizados)
```

### 5. Validación

**Siempre valida:**
```
@orchestrator-agent: Después de implementar "Crear Reserva", valida:
- Tabla Bookings existe con campos correctos
- Endpoints POST/GET/PUT/DELETE /api/bookings funcionan
- APIs están documentadas
- Diagrama ER muestra relación Users → Bookings
- Diagrama de flujo es actual
```

---

## 🐛 Troubleshooting

### Problema 1: Agente No Responde

**Síntomas:** Enviaste solicitud pero no hay respuesta

**Solución:**
1. Verifica sintaxis: `@nombre-agent: tarea`
2. Verifica que el agente existe en `AGENTS.md`
3. Lee archivo `.github/agents/nombre-agent.md` para entender qué quiere
4. Sé más específico en tu solicitud

---

### Problema 2: Inconsistencia Entre Dominios

**Síntomas:** Backend tiene un campo que BD no tiene

**Solución:**
```
@orchestrator-agent: Valida coherencia general y reporta:
- Campos en Backend/DTO que no existen en BD
- Tablas en BD sin endpoints en Backend
- APIs documentadas que no existen en código
```

---

### Problema 3: Agente Cambió Algo Que No Pediste

**Síntomas:** Backend Agent incluyó validaciones que no pediste

**Solución:**
1. **Sé más preciso:** "SIN validaciones adicionales" o "validaciones mínimas"
2. **Referencia documentos:** "Solo validaciones especificadas en specs"
3. **Pide confirmación:** "¿Está de acuerdo con estas validaciones?"

---

### Problema 4: Diagrama No Refleja Código

**Síntomas:** ER dice tabla tiene 5 campos pero código tiene 7

**Solución:**
```
@diagram-agent: El diagrama ER_FadeBooker.drawio está desfasado.
Actualiza tabla Users con nuevos campos:
- phone (nvarchar(20))
- isVerified (BIT)
Sincroniza con tabla Users actual en BD.
```

---

### Problema 5: No Sé Qué Agente Usar

**Guía rápida:**

| Necesito | Agente |
|----------|--------|
| Crear tabla / esquema BD | 🗄️ Database |
| Crear endpoint / endpoint | 🔧 Backend |
| Documentar API / escribir guía | 📋 Documentation |
| Crear diagrama / visualización | 📐 Diagram |
| Coordinar todo junto | 🎛️ Orchestrator |

---

## 📞 Resumen de Comandos Útiles

### Inicialización del Proyecto
```markdown
@orchestrator-agent: [SETUP] Inicia FadeBooker desde cero:
1. Database Agent: Crear todas las tablas según Diccionario de Datos
2. Backend Agent: Estructura inicial del proyecto
3. Documentation Agent: README, GETTING_STARTED
4. Diagram Agent: Convertir PDFs a .drawio
```

### Desarrollo de Funcionalidad
```markdown
@orchestrator-agent: [COMPLETE] Implementa [HISTORIA USUARIO]:
[Detalles específicos]
```

### Validación
```markdown
@orchestrator-agent: [AUDIT] Valida coherencia del proyecto actual
```

### Actualización Rápida
```markdown
@[agente-específico]: [Tarea específica sin coordinar otros]
```

---

## 📚 Recursos Adicionales

- **Instrucciones Globales:** `.github/copilot-instructions.md`
- **Registro de Agentes:** `.github/AGENTS.md`
- **Instrucciones Específicas:** `.github/agents/[nombre]-agent.md`
- **Documentación Proyecto:** `Documentación/`

---

## 🎓 Plantillas de Solicitud

### Template 1: Funcionalidad Completa
```markdown
@orchestrator-agent: [COMPLETE]
Implementa Historia Usuario: "[Nombre completo]"

Descripción:
- [Qué hace]
- [Quién lo usa]
- [Por qué es importante]

Requisitos Funcionales:
- [Req 1]
- [Req 2]
- [Req 3]

Requisitos Técnicos:
- [Tech req 1]
- [Tech req 2]

Restricciones:
- [Constraint 1]
- [Constraint 2]

Documentos de Referencia:
- [Documentación/Documentos/...]
- [Documentación/Material complementario/...]
```

### Template 2: Tarea Específica de Agente
```markdown
@[nombre-agent]: [Tarea específica]

Contexto:
- Relacionado a [Historia Usuario / Feature]
- Basado en [referencia documento]

Requisitos:
- [Req 1]
- [Req 2]

Formato esperado:
- [Formato/estructura]

Ejemplos:
- [Ejemplo 1]
- [Ejemplo 2]
```

---

## 🎉 Conclusión

Con esta guía, puedes:
✅ Invocar agentes correctamente  
✅ Coordinar desarrollo completo  
✅ Mantener coherencia entre dominios  
✅ Validar calidad del proyecto  
✅ Resolver problemas comunes  

**Siguiente paso:** Lee las instrucciones específicas de cada agente en `.github/agents/` para profundizar en sus capacidades.

---

**Versión:** 1.0.0  
**Última actualización:** 14 de abril de 2026  
**Autor:** Orchestrator Agent + Team
