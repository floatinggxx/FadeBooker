# Análisis Global del Proyecto FadeBooker 🎭

## 1. Visión General
**FadeBooker** es una plataforma de gestión de citas enfocada en servicios de barbería y fotografía. El proyecto está diseñado bajo una arquitectura robusta y cuenta con un ecosistema de desarrollo automatizado y orquestado mediante agentes de IA.

- **Backend (`Producto/back-fadebooker`)**: Desarrollado en Node.js con Express, Knex.js y arquitectura hexagonal. Se encuentra en un estado muy avanzado (98% completado).
- **Frontend (`Producto/front-fadebooker`)**: Cliente web basado en React, Vite, Tailwind CSS y Bootstrap. Actualmente en proceso de migración hacia una *Feature-Based Architecture*.
- **Infraestructura**: Despliegue orientado a Azure (App Service, Azure SQL), con integración continua a través de un `Jenkinsfile` y soporte para Docker.

## 2. Ecosistema de Agentes (El "Cerebro" del Proyecto)
El proyecto destaca por su avanzada estructura organizativa basada en agentes (documentada en `.github/AGENTS.md`), la cual divide las responsabilidades en múltiples niveles:

- **Nivel 1 (Entrada Única)**: `@system-orchestrator` encargado de recibir peticiones y delegarlas.
- **Nivel 2 (Orquestadores de Dominio)**: 
  - `@programming-orchestrator`: Para ciclo de vida de software.
  - `@study-orchestrator`: Para gestión de conocimiento y requerimientos.
  - `@data-orchestrator`: Para inteligencia de negocio y métricas.
- **Nivel 3 (Especialistas)**: Agentes dedicados para Front, Back, DB, Calidad, Arquitectura, DevOps, Documentación, etc.

## 3. Análisis de la Skill: `orchestrator-sync.md` ⚖️

La skill `orchestrator-sync` es **crítica** para mantener la integridad del proyecto, especialmente cuando ocurren cambios estructurales, como modificaciones en la base de datos (DB). Actúa como un protocolo de alineación.

### 🎯 Propósito
Garantizar que una modificación en un dominio (ej. la estructura de una tabla) se refleje consistentemente en los demás dominios (Backend, Documentación, Diagramas).

### 🛠️ Flujo de Acciones Estipulado
1. **Cross-Check**: Ante un cambio en la base de datos, el orquestador notifica al `@database-agent` y al `@backend-agent` para ajustar los modelos e instrucciones.
2. **Docs Sync**: Se invoca al `@documentation-agent` para registrar el cambio en el `CHANGELOG.md` y otros archivos base de conocimiento.
3. **Diagram Update**: Se instruye al `@diagram-agent` para actualizar los diagramas arquitectónicos y entidad-relación (`.drawio` o Mermaid).
4. **Status Update**: Modifica el progreso y porcentaje de completitud dentro del archivo `AGENTS.md`.

### ⚠️ Restricciones (Constraints)
- **Documentación estricta**: Ningún feature puede marcarse como completado si no tiene su respectiva documentación.
- **Prevención de regresiones**: Exige la validación de *breaking changes* antes de integrar cualquier rama (`feature/*`) a `develop`.

## 4. Oportunidades y Recomendaciones

1. **Sincronización del Frontend**: La skill `orchestrator-sync` menciona al `@backend-agent` y al `@database-agent` pero omite al `@frontend-agent`. Si se modifica la base de datos, las interfaces de Typescript/Zod y el consumo de la API en el frontend también deben actualizarse. Se recomienda incluir al `@frontend-agent` en el paso 1 de *Cross-Check*.
2. **Gestión de la Base de Conocimiento (`knowledge/`)**: Existe un script `extract_docs.py` que consolida documentación de Word/PDF a `.txt`. El orquestador debería asegurar que tras cambios masivos, se regenere este contexto técnico.
3. **Integración con CI/CD (Jenkins)**: La restricción de no hacer *merge* sin validar *breaking changes* podría reforzarse haciendo que el orquestador conecte esta validación con el agente `@dependency-pipeline-agent` o los tests del `Jenkinsfile`.

---
> [!TIP]
> Si deseas ejecutar alguna tarea específica o poner en marcha la skill `orchestrator-sync` para propagar algún cambio reciente en la base de datos, puedes solicitármelo y delegaremos la acción a los subagentes correspondientes.
