# 📚 Índice de Documentación FadeBooker (ESPAÑOL)

## 🌟 Bienvenido a FadeBooker

Esta es la **documentación completa en ESPAÑOL** del proyecto FadeBooker, una plataforma de agendamiento de citas para barberías.

**Versión:** 1.0.0  
**Última actualización:** 14 de abril de 2026  
**Idioma:** 🇪🇸 ESPAÑOL

---

## 🗂️ Documentos Principales

### 📖 Para Comenzar (START HERE)

| Documento | Propósito | Audiencia |
|-----------|-----------|-----------|
| [README_ES.md](README_ES.md) | **📍 COMIENZA AQUÍ** - Guía de instalación y uso | Todos |
| [.github/INSTRUCCIONES_GLOBALES_ES.md](.github/INSTRUCCIONES_GLOBALES_ES.md) | Instrucciones globales del proyecto | Todos |
| [.github/GUIA_AGENTES_ES.md](.github/GUIA_AGENTES_ES.md) | **Cómo usar los agentes especializados** | Desarrolladores |
| [.github/REFERENCIA_RAPIDA_ES.md](.github/REFERENCIA_RAPIDA_ES.md) | Cheat sheet de comandos y agentes | Desarrolladores |

### 🔧 Configuración y Deployment

| Documento | Propósito |
|-----------|-----------|
| [BACKEND_FIXES_APPLIED.md](BACKEND_FIXES_APPLIED.md) | Resumen de correcciones aplicadas al backend |
| [PROJECT_STATUS.md](PROJECT_STATUS.md) | Estado actual del proyecto |
| [DASHBOARD.md](DASHBOARD.md) | Dashboard de progreso |

### 🗄️ Base de Datos

| Documento | Propósito |
|-----------|-----------|
| [Documentación/ESPECIFICACION_BD.md](Documentación/ESPECIFICACION_BD.md) | Especificación completa del esquema BD |
| [Documentación/Documentos/Diccionario de Datos.xlsx](Documentación/Documentos/) | Diccionario de datos (Excel) |
| [Documentación/Material complementario/FadeBooker_ER_3NF.drawio](Documentación/Material%20complementario/) | Diagrama Entidad-Relación |

### 💻 Backend

| Documento | Propósito |
|-----------|-----------|
| [Producto/back-fadebooker/package.json](Producto/back-fadebooker/package.json) | Dependencias del proyecto |
| [Producto/back-fadebooker/CHANGELOG.md](Producto/back-fadebooker/CHANGELOG.md) | Historial de cambios |

### 📖 Especificaciones del Proyecto

| Documento | Propósito |
|-----------|-----------|
| [Documentación/Documentos/Requerimientos.xlsx](Documentación/Documentos/) | Requerimientos funcionales |
| [Documentación/Documentos/Historias Usuario.xlsx](Documentación/Documentos/) | Historias de usuario |
| [Documentación/Documentos/Acta de constitución.docx](Documentación/Documentos/) | Acta del proyecto |
| [Documentación/Documentos/EDT (Estructura Desglosada del Trabajo).xlsx](Documentación/Documentos/) | Desglose de trabajo |

### 🧪 Calidad y Testing

| Documento | Propósito |
|-----------|-----------|
| [Documentación/Documentos/Plan de Pruebas FadeBooker.docx](Documentación/Documentos/) | Plan completo de testing |
| [Documentación/Documentos/Matriz de pruebas BD.xlsx](Documentación/Documentos/) | Matriz de pruebas BD |
| [Documentación/Documentos/plan de calidad.docx](Documentación/Documentos/) | Plan de calidad |

### 📊 Diagramas y Visuales

| Documento | Tipo | Propósito |
|-----------|------|-----------|
| [Documentación/Material complementario/FadeBooker_ER_3NF.drawio](Documentación/Material%20complementario/) | Diagrama ER | Esquema de BD en 3NF |
| [Documentación/Material complementario/FadeBooker_Diagrama_Clase.pdf](Documentación/Material%20complementario/) | UML Clases | Modelo de objetos |
| [Documentación/Material complementario/FadeBooker_Diagrama_ActividadesUML.png](Documentación/Material%20complementario/) | UML Actividades | Flujos de procesos |
| [Documentación/Material complementario/FadeBooker_Esquema de la arquitectura.png](Documentación/Material%20complementario/) | Arquitectura | Estructura del sistema |
| [Documentación/Material complementario/FadeBooker_CartaGantt.pdf](Documentación/Material%20complementario/) | Gantt | Timeline del proyecto |

### 🤖 Instrucciones de Agentes

| Agente | Archivo | Descripción |
|--------|---------|-------------|
| **Database Agent** | [.github/agents/database-agent.md](.github/agents/database-agent.md) | Gestor de BD y esquemas |
| **Backend Agent** | [.github/agents/backend-agent.md](.github/agents/backend-agent.md) | Desarrollo de APIs |
| **Documentation Agent** | [.github/agents/documentation-agent.md](.github/agents/documentation-agent.md) | Documentación |
| **Diagram Agent** | [.github/agents/diagram-agent.md](.github/agents/diagram-agent.md) | Diagramas y visualización |
| **Orchestrator Agent** | [.github/agents/orchestrator-agent.md](.github/agents/orchestrator-agent.md) | Coordinación de agentes |

---

## 🚀 Guía de Uso Rápido

### 1️⃣ Primera Vez
```
1. Lee: README_ES.md
2. Lee: .github/INSTRUCCIONES_GLOBALES_ES.md
3. Instala: npm install en Producto/back-fadebooker
4. Configura: .env con credenciales Azure SQL
5. Verifica: npm run test:db
```

### 2️⃣ Trabajar con Agentes
```
1. Lee: .github/GUIA_AGENTES_ES.md
2. Consulta: .github/REFERENCIA_RAPIDA_ES.md
3. Invoca: @database-agent / @backend-agent / etc.
4. Coordina: De ser necesario, usa @orchestrator-agent
```

### 3️⃣ Entender la Arquitectura
```
1. Lee: Documentación/ESPECIFICACION_BD.md
2. Abre: Documentación/Material complementario/FadeBooker_ER_3NF.drawio
3. Revisa: Documentación/Material complementario/FadeBooker_Diagrama_Clase.pdf
4. Navega: Producto/back-fadebooker/src/ (estructura)
```

### 4️⃣ Desarrollo Backend
```
1. Lee: .github/agents/backend-agent.md
2. Revisa: Documentación/ESPECIFICACION_BD.md
3. Navega: Producto/back-fadebooker/src/domain/
4. Abre: .github/REFERENCIA_RAPIDA_ES.md (templates)
```

---

## 🎯 Por Rol

### 👨‍💼 Product Manager
- 📖 [Requerimientos](Documentación/Documentos/Requerimientos.xlsx)
- 📋 [Historias Usuario](Documentación/Documentos/Historias Usuario.xlsx)
- 📊 [Gantt](Documentación/Material%20complementario/FadeBooker_CartaGantt.pdf)
- ⚠️ [Riesgos](Documentación/Documentos/MATRIZ%20DE%20RIESGOS%20DEL%20PROYECTO.docx)

### 👨‍💻 Desarrollador Backend
- 📖 [Guía Instalación](README_ES.md)
- 🤖 [Guía Agentes](Documentación/.github/GUIA_AGENTES_ES.md)
- 🗄️ [Especificación BD](Documentación/ESPECIFICACION_BD.md)
- 💻 [Backend Agent]((.github/agents/backend-agent.md)
- 🔧 [Referencia Rápida](.github/REFERENCIA_RAPIDA_ES.md)

### 👨‍🔬 Especialista BD
- 🗄️ [Especificación BD](Documentación/ESPECIFICACION_BD.md)
- 📊 [Diagrama ER](Documentación/Material%20complementario/FadeBooker_ER_3NF.drawio)
- 📋 [Diccionario Datos](Documentación/Documentos/Diccionario de Datos.xlsx)
- 🤖 [Database Agent](.github/agents/database-agent.md)
- ✅ [Matriz Pruebas BD](Documentación/Documentos/Matriz de pruebas BD.xlsx)

### 📖 Documentador/QA
- 📖 [Guía Agentes](.github/GUIA_AGENTES_ES.md)
- 🤖 [Documentation Agent](.github/agents/documentation-agent.md)
- 🧪 [Plan de Pruebas](Documentación/Documentos/Plan de Pruebas FadeBooker.docx)
- ✅ [Calidad](Documentación/Documentos/plan de calidad.docx)

### 📊 Diseñador/Arquitecto
- 📊 [Diagramas](Documentación/Material%20complementario/)
- 🏛️ [Arquitectura](Documentación/Material%20complementario/FadeBooker_Esquema%20de%20la%20arquitectura.png)
- 📋 [UML Clases](Documentación/Material%20complementario/FadeBooker_Diagrama_Clase.pdf)
- 🤖 [Diagram Agent](.github/agents/diagram-agent.md)

---

## 🔗 Estructura de Directorios

```
FadeBooker/
├── README_ES.md                    ← 📍 COMIENZA AQUÍ
├── BACKEND_FIXES_APPLIED.md        ← Resumen de correcciones
├── PROJECT_STATUS.md               ← Estado del proyecto
├── DASHBOARD.md                    ← Progreso
│
├── .github/
│   ├── INSTRUCCIONES_GLOBALES_ES.md     ← Instrucciones principales
│   ├── GUIA_AGENTES_ES.md               ← Cómo usar agentes
│   ├── REFERENCIA_RAPIDA_ES.md          ← Cheat sheet
│   ├── INDICE_DOCUMENTACION_ES.md       ← Este archivo
│   ├── copilot-instructions.md          ← EN INGLÉS
│   ├── AGENTS.md                        ← Registro de agentes
│   └── agents/
│       ├── database-agent.md
│       ├── backend-agent.md
│       ├── documentation-agent.md
│       ├── diagram-agent.md
│       └── orchestrator-agent.md
│
├── Documentación/
│   ├── ESPECIFICACION_BD.md
│   ├── Documentos/
│   │   ├── Requerimientos.xlsx
│   │   ├── Historias Usuario.xlsx
│   │   ├── Diccionario de Datos.xlsx
│   │   ├── EDT...xlsx
│   │   ├── Plan de Pruebas...docx
│   │   ├── Matriz de pruebas BD...xlsx
│   │   ├── plan de calidad.docx
│   │   ├── MATRIZ DE RIESGOS.docx
│   │   └── Acta de constitución.docx
│   └── Material complementario/
│       ├── FadeBooker_ER_3NF.drawio
│       ├── FadeBooker_Diagrama_Clase.pdf
│       ├── FadeBooker_Diagrama_ActividadesUML.png
│       ├── FadeBooker_Esquema de la arquitectura.png
│       ├── FadeBooker_CartaGantt.pdf
│       ├── Logical_Fadebooker.html
│       └── Relational_Fadebooker.html
│
├── Producto/
│   └── back-fadebooker/
│       ├── src/
│       ├── package.json
│       ├── CHANGELOG.md
│       └── index.js
│
└── Gestión/
```

---

## ✅ Estado de Documentación

| Área | Estado | Última Actualización |
|------|--------|---------------------|
| Instrucciones Globales | ✅ Completo | 14 de abril |
| Guía de Agentes | ✅ Completo | 14 de abril |
| README | ✅ Completo | 14 de abril |
| Especificación BD | ✅ Completo | 14 de abril |
| Backend Fixes | ✅ Completo | 14 de abril |
| API Documentation | ⏳ En progreso | - |
| Deployment Guide | ⏳ Por hacer | - |
| User Manual | ⏳ Por hacer | - |

---

## 🆘 Troubleshooting

### No encuentro un documento
- Revisa esta página (Tabla de Contenidos arriba)
- Usa Ctrl+F para buscar
- Consulta la estructura de directorios

### Necesito reportar un problema
- Abre issue en GitHub
- Si es sobre documentación: crea PR
- Si es sobre código: contacta al Backend Agent

### ¿Qué documento leer para X?

**"Quiero comenzar a desarrollo backend"**  
→ Lee: README_ES.md → GUIA_AGENTES_ES.md → Backend Agent

**"Necesito entender la BD"**  
→ Lee: ESPECIFICACION_BD.md → Abre: ER Diagram → Consulta: Diccionario Datos

**"Voy a hacer una PR"**  
→ Lee: REFERENCIA_RAPIDA_ES.md → Coordina con Orchestrator Agent

**"¿Cómo invoco a un agente?"**  
→ Lee: GUIA_AGENTES_ES.md o REFERENCIA_RAPIDA_ES.md

---

## 📞 Contacto

- **Documentación Principal:** README_ES.md
- **Instrucciones:** .github/INSTRUCCIONES_GLOBALES_ES.md
- **Agentes:** .github/GUIA_AGENTES_ES.md
- **Issues:** GitHub Issues
- **Discussiones:** GitHub Discussions

---

## 🎓 Recursos Adicionales

### Para Aprender Sobre FadeBooker
1. Acta de Constitución (para contexto)
2. Requerimientos (qué debe hacer)
3. Historias Usuario (cómo se usa)
4. Diagramas ER (estructura de datos)
5. Backend Fixes (estado actual)

### Para Trabajar en FadeBooker
1. README_ES (instalación)
2. Instrucciones Globales (convenciones)
3. Guía Agentes (cómo coordinar)
4. Referencia Rápida (templates)
5. Especificación BD (para consultar)

### Para Reportar/Documentar
1. Plan de Pruebas (qué probar)
2. Plan de Calidad (estándares)
3. Documentation Agent (cómo documentar)
4. Guía Agentes (comunicación)

---

## 📊 Estadísticas del Proyecto

- **Documentos:** 25+
- **Diagramas:** 5
- **Tablas BD:** 11
- **Endpoints:** 20+
- **Estado:** 🔄 En Desarrollo
- **Team:** Académico/Empresarial

---

## 🔄 Mejoras Futuras de Documentación

- [ ] API Reference (Swagger/OpenAPI)
- [ ] Deployment Guide
- [ ] User Manual
- [ ] Developer Handbook
- [ ] Changelog detallado
- [ ] Video tutorials

---

**Última actualización:** 14 de abril de 2026  
**Versión:** 1.0.0 (ESPAÑOL)  
**Mantenedor:** @orchestrator-agent  
🇪🇸 **ESPAÑOL**
