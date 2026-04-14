# 🎭 FadeBooker - Instrucciones Globales para Copilot Agents

## 📌 Visión General del Proyecto

**FadeBooker** es una plataforma de gestión de citas para barberías. Similar a Uber Eats pero para agendamiento de servicios de barbería.

- **Tipo:** Fullstack - Backend + Base de Datos + Documentación + Diagramas
- **BD:** Azure SQL Server (`fadebooker-server.database.windows.net` / `FadeBooker_DB`)
- **Modelo:** Marketplace de barberías donde clientes pueden agendar citas con barberos
- **Estado:** Fase documentación → Implementación
- **Equipo:** Proyecto académico/empresarial con múltiples stakeholders

---

## 📁 Estructura de Carpetas

```
FadeBooker/
├── .github/
│   ├── copilot-instructions.md      ← Instrucciones globales (este archivo)
│   ├── AGENTS.md                    ← Registro y configuración de agentes
│   └── agents/                      ← Instrucciones específicas por agente
│       ├── database-agent.md
│       ├── backend-agent.md
│       ├── documentation-agent.md
│       ├── diagram-agent.md
│       └── orchestrator-agent.md
│
├── Documentación/
│   ├── Documentos/                  (Especificaciones, requerimientos, diccionario)
│   ├── Material complementario/     (Diagramas ER, UML, arquitectura)
│   └── README.md                    (Documentación principal - crear)
│
├── Gestión/                         (Documentos de gestión del proyecto)
│
├── Producto/                        (Especificaciones del producto)
│
├── backend/                         (Código fuente - crear)
│   ├── src/
│   ├── tests/
│   ├── config/
│   └── docs/
│
├── database/                        (Scripts SQL - crear)
│   ├── scripts/
│   ├── migrations/
│   ├── seeds/
│   └── schemas/
│
└── .git/
```

---

## 🎯 Convenciones Globales

### Nomenclatura
- **Carpetas:** `lowercase-with-hyphens`
- **Archivos:** `PascalCase.sql`, `camelCase.ts`, `snake_case.json`
- **Tablas BD:** `PascalCase` (singular o plural según dominio)
- **Columnas BD:** `camelCase`
- **Variables código:** `camelCase`
- **Constantes código:** `UPPER_SNAKE_CASE`

### Lenguajes & Stack (Inferido)
- **BD:** SQL Server T-SQL
- **Backend:** (Detectar de documentación - asumir Node.js/TypeScript o C#/.NET)
- **Documentación:** Markdown
- **Diagramas:** draw.io

### Branching & Git
- Main: `main` (producción)
- Development: `develop` (integración)
- Features: `feature/nombre-feature`
- Hotfix: `hotfix/descripción`

### Versionado
- Semántica: `MAJOR.MINOR.PATCH`
- Changelog: actualizar `CHANGELOG.md`

---

## 🤖 Estrategia de Agentes

### Coordinación
Los agentes funcionan de forma **independiente pero coordinada**:

1. **Database Agent** crea/actualiza esquema BD
2. **Backend Agent** usa esquema de BD para generar código
3. **Documentation Agent** documenta ambos
4. **Diagram Agent** visualiza arquitectura
5. **Orchestrator Agent** coordina flujo completo

### Principios Compartidos
- ✅ **DRY:** No duplicar lógica o documentación
- ✅ **SINGLE RESPONSIBILITY:** Cada agente tiene un propósito claro
- ✅ **CONSISTENCY:** Mantener estándares del proyecto
- ✅ **CLARITY:** Código y documentación legibles
- ✅ **TESTABILITY:** Todo debe ser verificable

### Comunicación Entre Agentes
- Usar `AGENTS.md` como fuente única de verdad
- Cada agente lee instrucciones en `.github/agents/`
- Los cambios en un dominio se comunican en MR/PR descriptions

---

## 📋 Documentación de Referencia

### Especificaciones Clave
- **Requerimientos:** `Documentación/Documentos/Requerimientos.xlsx`
- **Historias Usuario:** `Documentación/Documentos/Historias Usuario.xlsx`
- **Diccionario Datos:** `Documentación/Documentos/Diccionario de Datos.xlsx`
- **Acta Constitución:** `Documentación/Documentos/Acta de constitución.docx`

### Arquitectura & Diseño
- **Diagrama ER:** `Documentación/Material complementario/FadeBooker_Diagrama_ER.pdf`
- **Diagrama Clases:** `Documentación/Material complementario/FadeBooker_Diagrama_Clase.pdf`
- **Diagrama UML:** `Documentación/Material complementario/FadeBooker_Diagrama_ActividadesUML.png`
- **Esquema Arquitectura:** `Documentación/Material complementario/FadeBooker_Esquema de la arquitectura.png`

### Planificación
- **EDT:** `Documentación/Documentos/EDT (Estructura Desglosada del Trabajo).xlsx`
- **Gantt:** `Documentación/Material complementario/FadeBooker_CartaGantt.pdf`
- **Riesgos:** `Documentación/Documentos/MATRIZ DE RIESGOS DEL PROYECTO.docx`

### Testing & Calidad
- **Plan Pruebas:** `Documentación/Documentos/Plan de Pruebas FadeBooker.docx`
- **Matriz Pruebas BD:** `Documentación/Documentos/Matriz de pruebas BD.xlsx`
- **Plan Calidad:** `Documentación/Documentos/plan de calidad.docx`

---

## 🔌 Conexión Base de Datos

### Conexión Actual
```
Servidor: fadebooker-server.database.windows.net
BD: FadeBooker_DB
Usuario: adminuser
Autenticación: SQL Login
Estado: ✅ ACTIVA
```

### Consideraciones
- BD está vacía (lista para crear esquema)
- User tiene permisos totales (db_owner equivalente)
- Usar T-SQL para scripts
- Versionamiento: migrations con timestamp

---

## 📝 Guías de Contribución

### Crear Agente Nuevo
1. Crear archivo en `.github/agents/nombre-agent.md`
2. Registrar en `AGENTS.md`
3. Incluir: propósito, responsabilidades, inputs, outputs, ejemplos
4. Referenciar en instrucciones relevantes

### Actualizar Instrucciones
- Mantener `copilot-instructions.md` como fuente de verdad
- Cambios globales aquí
- Cambios específicos en `.github/agents/`
- No duplicar información

### Convención de Prompts
Todos los prompts deben:
- Citar el agente responsable (ej: `@database-agent`)
- Describir qué quieren lograr
- Proporcionar contexto si es necesario
- Especificar formato deseado (SQL, TypeScript, Markdown, etc.)

---

## 🚀 Próximos Pasos

**Fase Actual: Setupeo de Agentes**
1. ✅ Creadas instrucciones globales
2. ⏳ Crear AGENTS.md (registro)
3. ⏳ Database Agent (.github/agents/database-agent.md)
4. ⏳ Backend Agent (.github/agents/backend-agent.md)

**Fase 2: Implementación**
- Documentation Agent
- Diagram Agent
- Orchestrator Agent

**Fase 3: Desarrollo**
- Crear esquema BD
- Generar código backend
- Documentar API
- Crear diagramas

---

## 📞 Referencias

- **Repositorio:** `c:\Users\Mauricio\Documents\GitHub\FadeBooker`
- **Conexión BD:** ID `8db9ecf2-0e44-49d4-aaf3-8b00fe86a57b` (MSSQL)
- **Documento Base:** Este archivo (`copilot-instructions.md`)

---

**Última actualización:** 14 de abril de 2026
**Versión:** 1.0.0
