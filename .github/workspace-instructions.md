# 📐 Workspace Instructions Template - FadeBooker

**Propósito:** Servir como guía de convenciones y principios para crear/mantener instrucciones de agentes en FadeBooker.

---

## 🎯 Principios Fundamentales

### 1. Link, Don't Embed
- **❌ Evitar:** Copiar contenido entre archivos
- **✅ Hacer:** Crear links entre documentos relacionados
- **Ejemplo:** En lugar de repetir convenciones SQL en cada agente, linkalr a `copilot-instructions.md`

### 2. Single Source of Truth
- **Global:** `.github/copilot-instructions.md` (convenciones globales)
- **Por Agente:** `.github/agents/[nombre]-agent.md` (instrucciones específicas)
- **Guía de Uso:** `.github/AGENTS_USER_GUIDE.md` (cómo usar)
- **Registro:** `.github/AGENTS.md` (qué agentes existen)

### 3. Progressive Detail
Estructura la información de menos a más detalle:
```
AGENTS.md (qué agentes hay)
    ↓
AGENTS_USER_GUIDE.md (cómo usarlos)
    ↓
agents/[nombre]-agent.md (instrucciones detalladas)
    ↓
copilot-instructions.md (principios globales)
```

### 4. Clear Boundaries
Cada archivo tiene una jurisdicción clara:
- **copilot-instructions.md:** Convenciones globales, stack, estructura
- **agents/[nombre]-agent.md:** Responsabilidades, checklist, ejemplos
- **AGENTS.md:** Qué cada agente hace (resumen)
- **AGENTS_USER_GUIDE.md:** Cómo invocar y flujos

❌ **No repeties lo mismo en múltiples archivos**

---

## 📁 Estructura de Archivos de Instrucciones

```
.github/
├── copilot-instructions.md              (GLOBAL - Principios, stack, convenciones)
├── AGENTS.md                            (REGISTRO - Lista y descripción de agentes)
├── AGENTS_USER_GUIDE.md                 (GUÍA - Cómo usar agentes (flujos, ejemplos)
└── agents/
    ├── database-agent.md                (ESPECÍFICO - Responsabilidades DB)
    ├── backend-agent.md                 (ESPECÍFICO - Responsabilidades Backend)
    ├── documentation-agent.md           (ESPECÍFICO - Responsabilidades Docs)
    ├── diagram-agent.md                 (ESPECÍFICO - Responsabilidades Diagramas)
    └── orchestrator-agent.md            (ESPECÍFICO - Responsabilidades Coordinación)
```

---

## 📋 Checklist para Crear Nueva Instrucción de Agente

Usa este checklist cuando crees un nuevo agente:

### 1. Archivo de Instrucción (`.github/agents/nuevo-agent.md`)
- [ ] Encabezado claro con propósito
- [ ] Sección "Visión General" (qué hace)
- [ ] "Tu Jurisdicción" - qué hace y qué NO hace
- [ ] Sección de "Instrucciones Específicas" para tareas
- [ ] Checklist de validación antes de entregar
- [ ] Ejemplos de invocación reales
- [ ] Links a documentos relacionados
- [ ] Sección "Primeros Pasos"

### 2. Actualizar `AGENTS.md`
- [ ] Agregar entrada del nuevo agente
- [ ] Include: Propósito, Responsabilidades, Inputs, Outputs
- [ ] Link a archivo específico de agente
- [ ] Ejemplo de invocación
- [ ] Actualizar tabla de estado
- [ ] Actualizar diagrama de coordinación si aplica

### 3. Actualizar `AGENTS_USER_GUIDE.md`
- [ ] Agregar fila a tabla de agentes
- [ ] Incluir en sección "Resumen de Comandos Útiles"
- [ ] Actualizar templates si aplica
- [ ] Agregar ejemplo práctico si es un caso común

### 4. Actualizar `copilot-instructions.md`
- [ ] Solo si cambian convenciones globales
- [ ] Link al nuevo agente en sección "Agentes"
- [ ] Actualizar "Próximos Pasos" si es nuevo agente principal

---

## 🎨 Template para Nuevo Agent File

```markdown
# [EMOJI] [Nombre] Agent - Instrucciones Detalladas

**Versión:** 1.0.0  
**Última actualización:** [FECHA]  
**Propósito:** [Descripción de propósito]

---

## 📌 Visión General

Eres el **[Nombre] Agent**, especialista en [dominio]. Tu responsabilidad es:

1. [Responsabilidad 1]
2. [Responsabilidad 2]
3. [Responsabilidad 3]

---

## 🎯 Tu Jurisdicción

### ✅ Haces
- [Tarea 1]
- [Tarea 2]

### ❌ No haces
- [Lo que otros agentes hacen]
- [Fuera de scope]

---

## [Contenido Específico del Agente]

[Instrucciones detalladas, ejemplos, checklist, recursos]

---

## 📋 Checklist Antes de Entregar

- [ ] [Validación 1]
- [ ] [Validación 2]
- [ ] [Validación 3]

---

## 📞 Ejemplos de Invocación

```markdown
@[nombre-agent]: [Ejemplo 1]

@[nombre-agent]: [Ejemplo 2]
```

---

**Última actualización:** [FECHA]  
**Versión:** 1.0.0
```

---

## 📝 Template para Sección en AGENTS.md

Cuando agregues nuevo agente a AGENTS.md:

```markdown
### X️⃣ **[Nombre] Agent** [EMOJI]
**Propósito:** [Una línea clara]

**Responsabilidades:**
- [Responsabilidad 1]
- [Responsabilidad 2]

**Inputs:**
- [Input 1]
- [Input 2]

**Outputs:**
- [Output 1]
- [Output 2]

**Instrucciones:** [`.github/agents/nombre-agent.md`](...)

**Ejemplo de uso:**
```
@nombre-agent: [Ejemplo claro y específico]
```
```

---

## 🔄 Reglas de Links

### Cuándo Linkar
- Referencias a instrucciones detalladas
- Referencias a archivos de código/documentación
- Referencias a ejercicios o ejemplos en otros archivos
- Referencias a documentos de especificación

### Cómo Linkar
```markdown
# Global → Específico
Vea [instrucciones del Database Agent](.github/agents/database-agent.md).

# Específico → Global
Referencia [convenciones de nomenclatura](copilot-instructions.md#nomenclatura).

# A documentación del proyecto
Leer [Diccionario de Datos](Documentación/Documentos/Diccionario de Datos.xlsx).
```

### Qué NO Linkar
- ❌ No copiar texto entero "para ser redundante"
- ❌ No crear links circulares (A → B → A)
- ❌ No linkar a archivos que aún no existen

---

## 🚀 Extensión Futura: Crear Nuevo Agente

Cuando necesites agregar un nuevo agente (ejemplo: Testing Agent):

### Paso 1: Crear archivo de instrucciones
📄 `.github/agents/testing-agent.md`
- Usar template anterior
- Incluir checklist de validación
- Ejemplos específicos

### Paso 2: Registrar en AGENTS.md
- Agregar entrada en sección de agentes
- Actualizar tabla de estado (cambiar a "En desarrollo")
- Actualizar diagrama de coordinación

### Paso 3: Actualizar AGENTS_USER_GUIDE.md
- Agregar a tabla de invocación rápida
- Incluir en flujos de trabajo donde aplique
- Agregar ejemplo práctico

### Paso 4: Actualizar copilot-instructions.md
- Link al nuevo agente en sección "Agentes"
- Mencionar en "Próximos Pasos" si es importante

### Paso 5: Validar
- ✅ No hay duplicación de contenido
- ✅ Links correctos y funcionales
- ✅ Ejemplos son claros y ejecutables
- ✅ Jurisdicción está clara (no solapamiento con otros agentes)

---

## ✨ Anti-Patterns a Evitar

### ❌ Anti-Pattern 1: Duplicación de Contenido
```markdown
MALO:
En AGENTS.md:
- Database Agent crea tablas

En agents/database-agent.md:
- Database Agent crea tablas con [TEXTO DUPLICADO]

CORRECTO:
AGENTS.md: Database Agent crea tablas [linkar a database-agent.md]
agents/database-agent.md: [Contenido detallado único]
```

### ❌ Anti-Pattern 2: Instrucciones Vagas
```markdown
MALO:
"Crea tablas"

CORRECTO:
"Crea tabla Users con campos id (PK), email (UNIQUE), firstName, lastName, createdAt"
```

### ❌ Anti-Pattern 3: Sin Ejemplos
```markdown
MALO:
"Crea un endpoint REST"

CORRECTO:
"Crea endpoint POST /api/users que acepta CreateUserDTO 
y retorna UserResponseDTO con status 201"
```

### ❌ Anti-Pattern 4: Jurisdicción Solapada
```markdown
MALO:
Backend Agent: "Crear documentación de APIs"
Documentation Agent: "Crear documentación de APIs"

CORRECTO:
Backend Agent: "Crear APIs y comentarios inline"
Documentation Agent: "Crear archivo API_DOCUMENTATION.md"
```

### ❌ Anti-Pattern 5: Links Rotos
```markdown
MALO:
Vea [aquí](archivo-que-no-existe.md)

CORRECTO:
Vea [instrucciones de database-agent](.github/agents/database-agent.md)
```

---

## 📊 Formato y Estilo

### Encabezados
```markdown
# H1 - Título principal del documento
## H2 - Secciones principales
### H3 - Subsecciones
#### H4 - Detalles menores (usado raramente)
```

### Énfasis
```markdown
**Bold** - Para términos importantes
*Italic* - Para referencias
`Code` - Para names técnicos, archivos, código
```

### Listas
```markdown
### Checklist
- [ ] Item 1
- [ ] Item 2

### Bullet Points
- Punto 1
- Punto 2

### Numbered
1. Primero
2. Segundo
```

### Bloques de Código
```markdown
```markdown
Usar markdown para ejemplos de invocación
```

```sql
Usar sql para ejemplos SQL
```

```typescript
Usar typescript para ejemplos de código
```
```

### Tablas
```markdown
| Header | Header |
|--------|--------|
| Cell   | Cell   |
```

---

## 🔧 Herramientas Útiles

### Validar Links (después de crear)
- [ ] Checkear que todos los links `.md` apunten a archivos reales
- [ ] Checkear que las anchors `#seccion` correspondan a encabezados reales
- [ ] Checkear que no haya links circulares (A → B → A)

### Validar Duplicación
- [ ] Usar Ctrl+F para buscar palabras clave en múltiples archivos
- [ ] Asegurar que concepto aparece en UN solo lugar (luego linkar)
- [ ] Si aparece en múltiples, consolidar en un lugar y linkar

### Validar Especificidad
- [ ] Leer ejemplos - ¿son específicos y ejecutables?
- [ ] Leer jurisdicción - ¿está claro qué hace y qué no?
- [ ] Leer checklist - ¿es verificable?

---

## 📞 Resumen para Usuarios

Una vez que las instrucciones estén lisas, el usuario debe:

1. **Leer en orden:**
   - `.github/AGENTS.md` - Qué agentes existen
   - `.github/AGENTS_USER_GUIDE.md` - Cómo usarlos
   - `.github/agents/[nombre]-agent.md` - Detalles específicos

2. **Usar agentes con:**
   - Sintaxis: `@nombre-agent: tarea`
   - Tarea específica y clara
   - Contexto si es necesario

3. **Validar:**
   - Resultado coherente
   - Sin duplicación de código
   - Documentación actualizada

---

## 🎯 Estado Actual (FadeBooker)

### ✅ Completado
- [x] `.github/copilot-instructions.md` - Instrucciones globales
- [x] `.github/AGENTS.md` - Registro de 5 agentes
- [x] `.github/AGENTS_USER_GUIDE.md` - Manual de uso
- [x] `.github/agents/database-agent.md` - DB Agent
- [x] `.github/agents/backend-agent.md` - Backend Agent
- [x] `.github/agents/documentation-agent.md` - Documentation Agent
- [x] `.github/agents/diagram-agent.md` - Diagram Agent
- [x] `.github/agents/orchestrator-agent.md` - Orchestrator Agent

### ⏳ Próximas Extensiones (Opcional)
- [ ] Testing Agent (para tests unitarios/integración)
- [ ] DevOps Agent (para deployment/CI-CD)
- [ ] Security Agent (para auditoría de seguridad)

Para cada uno, seguir este template y el checklist anterior.

---

## 📚 Referencias

- **Init Prompt:** Workflow bootstrap de workspace instructions
- **Principio DRY:** Don't Repeat Yourself
- **Convención:** "Link, don't embed"

---

**Versión:** 1.0.0  
**Última actualización:** 14 de abril de 2026  
**Propósito:** Servir como guía para crear y mantener instrucciones de agentes en FadeBooker
