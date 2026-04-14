# 🎭 FadeBooker - Instrucciones Globales para Agentes Copilot (ESPAÑOL)

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
│   ├── INSTRUCCIONES_GLOBALES_ES.md  ← Instrucciones globales en ESPAÑOL (este archivo)
│   ├── copilot-instructions.md        ← Instrucciones globales EN INGLÉS
│   ├── AGENTS.md                      ← Registro de agentes
│   └── agents/                        ← Instrucciones específicas por agente
│       ├── database-agent.md          (español)
│       ├── backend-agent.md           (español)
│       ├── documentation-agent.md     (español)
│       ├── diagram-agent.md           (español)
│       └── orchestrator-agent.md      (español)
│
├── Documentación/
│   ├── Documentos/                    (Especificaciones, requerimientos, diccionario)
│   ├── Material complementario/       (Diagramas ER, UML, arquitectura)
│   └── README.md                      (Documentación principal)
│
├── Gestión/                           (Documentos de gestión del proyecto)
│
├── Producto/                          (Especificaciones del producto)
│
├── backend/                           (Código fuente)
│   ├── src/
│   ├── tests/
│   ├── config/
│   └── docs/
│
├── database/                          (Scripts SQL)
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

### Lenguajes & Stack
- **BD:** SQL Server T-SQL
- **Backend:** Node.js/JavaScript (actual backend en `Producto/back-fadebooker`)
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
- Cambios comunicados en descripción de MR/PR

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
- BD está lista (esquema completo ya existe)
- User tiene permisos totales (db_owner equivalente)
- Usar T-SQL para scripts
- Versionamiento: migrations con timestamp

### Tablas Disponibles (11 total)
1. Usuario - Base de datos de usuarios
2. Barbero - Clave foránea a Usuario
3. Cliente - Clave foránea a Usuario
4. Cita - Registros de citas/reservas
5. Servicio - Catálogo de servicios
6. ServicioTienda - Tabla de unión (muchos-a-muchos)
7. Tienda - Ubicaciones/sucursales
8. Pago - Registros de pagos
9. Reseña - Sistema de calificaciones
10. AuditoriaCancelacion - Auditoría
11. AuditoriaPreciosServicio - Auditoría

---

## 📝 Guías de Contribución

### Crear Agente Nuevo
1. Crear archivo en `.github/agents/nombre-agent.md`
2. Registrar en `AGENTS.md`
3. Incluir: propósito, responsabilidades, inputs, outputs, ejemplos
4. Referenciar en instrucciones relevantes

### Actualizar Instrucciones
- Mantener `INSTRUCCIONES_GLOBALES_ES.md` como fuente de verdad
- Cambios globales aquí
- Cambios específicos en `.github/agents/`
- No duplicar información

### Convención de Prompts
Todos los prompts deben:
- Citar el agente responsable (ej: `@database-agent`)
- Describir qué quieren lograr
- Proporcionar contexto si es necesario
- Especificar formato deseado (SQL, JavaScript, Markdown, etc.)

---

## 🚀 Próximos Pasos

**Fase Actual: Setupeo de Agentes** ✅ COMPLETADA
- ✅ Instrucciones globales validadas
- ✅ AGENTS.md (registro) creado
- ✅ Database Agent configurado
- ✅ Backend Agent configurado
- ✅ Documentation Agent configurado
- ✅ Diagram Agent configurado
- ✅ Orchestrator Agent configurado

**Fase 2: Implementación** 🔄 EN PROGRESO
- ✅ Esquema BD creado y validado
- ✅ Backend conectado a Azure SQL
- ✅ Modelos de datos expandidos
- ⏳ Documentación de API en progreso
- ⏳ Diagramas actualizados

**Fase 3: Desarrollo**
- Tests de integración
- Deployment en staging
- Tests de calidad
- Deployment en producción

---

## 📞 Referencias

- **Repositorio:** `c:\Users\SanNi\OneDrive\Escritorio\Barberia\FadeBooker`
- **Conexión BD:** `fadebooker-server.database.windows.net / FadeBooker_DB`
- **Documento Base:** `INSTRUCCIONES_GLOBALES_ES.md` (este archivo)
- **Documento Base EN:** `copilot-instructions.md`

---

**Última actualización:** 14 de abril de 2026  
**Versión:** 1.0.0 (ESPAÑOL)  
**Idioma:** 🇪🇸 ESPAÑOL
