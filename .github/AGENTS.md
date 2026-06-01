# 🤖 Ecosistema de Agentes — Sistema Universal Multi-Proyecto

**Versión:** 3.0.0 | **Última actualización:** 28 de mayo de 2026

Este repositorio usa una arquitectura de tres niveles de coordinación de agentes, diseñada para funcionar en cualquier tipo de proyecto: educativo, de datos/ML o de desarrollo de software.

1. **Orquestador principal (`@system-orchestrator`)**: punto de entrada único — clasifica y enruta.
2. **Orquestadores de dominio** (nivel 2): uno por cada dominio técnico.
3. **Agentes especialistas** (nivel 3): ejecutan tareas concretas y entrenables.

---

## 🗺️ Mapa de Estructura de Carpetas

```
.github/
  system-orchestrator.agent.md      ← orquestador principal (ENTRADA ÚNICA)
  AGENTS.md                          ← este archivo
  copilot-instructions.md            ← reglas globales del workspace
  agents/
    study/                           ← agentes del sistema educativo
    data/                            ← agentes del pipeline EDA-ACV / ML
    programming/                     ← agentes de desarrollo de software
    support/                         ← agentes compartidos entre dominios
  skills/
    programming/                     ← skills técnicos de software
  instructions/                      ← instrucciones específicas de archivo
  prompts/                           ← prompts de entrada del editor
  agent-workflows/                   ← lecciones aprendidas y flujos documentados
```

---

## 🧭 Nivel 1 — Orquestador Principal

| Agente | Rol | Cuándo invocarlo |
| :--- | :--- | :--- |
| **@system-orchestrator** | Orquestador principal | Punto de entrada único — clasifica solicitudes y delega al dominio correcto |

**Ruta del archivo:** `.github/system-orchestrator.agent.md`

---

## 📁 Nivel 2 — Orquestadores de Dominio

| Orquestador | Dominio | Ruta |
| :--- | :--- | :--- |
| **@study-orchestrator** | Sistema educativo (tutores, quizzes, knowledge base) | `.github/agents/study/study-orchestrator.agent.md` |
| **@data-orchestrator** | Pipeline EDA-ACV, ML, limpieza, modelado | `.github/agents/data/data-orchestrator.agent.md` |
| **@programming-orchestrator** | Desarrollo de software: APIs, BD, frontend, docs, tests | `.github/agents/programming/programming-orchestrator.agent.md` |

---

## 🤝 Agentes de Soporte Compartido

| Agente | Rol | Ruta |
| :--- | :--- | :--- |
| **@github-git-agent** | Gestión de commits, ramas y pull requests | `.github/agents/support/github-git-agent.md` |

---

## 🎓 Nivel 3A — Agentes del Sistema Educativo

**Orquestador:** `@study-orchestrator` | **Carpeta:** `.github/agents/study/`

| Agente | Rol | Cuándo invocarlo |
| :--- | :--- | :--- |
| **@study-orchestrator** | Director del sistema de estudio | Orquestador interno para cualquier solicitud de estudio, resumen o evaluación |
| **@content-reader** | Lector del knowledge base | Resumir archivos del curso, sintetizar temas, leer `knowledge/` |
| **@preprocesamiento-tutor** | Tutor de Preprocesamiento de Datos | Preguntas de estadística, EDA, limpieza, escalado, encoding, feature engineering |
| **@programacion-tutor** | Tutor de Programación para Ciencia de Datos | Preguntas de Python, ML, clustering, Git, visualización interactiva |
| **@quiz-generator** | Generador de evaluaciones | Crear quizzes, simulacros, ejercicios de código y fichas de repaso |

### Knowledge Base
- `Semestre 1 mención/` — Material original
- `knowledge/` — Contenido extraído en Markdown

```bash
# Inicializar knowledge base (ejecutar una vez)
pip install -r scripts/requirements_extraction.txt
python scripts/extract_course_content.py
```

---

## 🔬 Nivel 3B — Agentes del Pipeline EDA-ACV

**Orquestador:** `@data-orchestrator` | **Carpeta:** `.github/agents/data/`

| Agente | Rol | Responsabilidad Principal | Carpeta de Trabajo |
| :--- | :--- | :--- | :--- |
| **@data-extractor** | Extractor | Ingesta y extracción de datos desde diversas fuentes | `src/0_audit/` |
| **@data-cleaner** | Limpiador | Limpieza, feature engineering y escalado | `src/1_prep/` |
| **@data-analyzer** | Analizador | EDA, análisis exploratorio y estadístico | `src/2_unsupervised/` |
| **@stats-modeler** | Modelador | Modelos ML, hiperparámetros, validación | `src/3_optuna/` + `src/4_train/` |
| **@data-visualizer** | Visualizador | Gráficos, métricas y artefactos visuales | `src/5_report/` |
| **@data-reporter** | Reporteador | Narrativas de negocio y documentación de resultados | `reports/` |

### Comandos del Pipeline
```bash
python setup_and_run.py --mode status --venv-name venv --skip-install
python setup_and_run.py --mode run --venv-name venv --skip-install
```

---

## 💻 Nivel 3C — Agentes de Programación

**Orquestador:** `@programming-orchestrator` | **Carpeta:** `.github/agents/programming/`

| Agente | Rol | Cuándo invocarlo |
| :--- | :--- | :--- |
| **@programming-orchestrator** | Director de desarrollo | Punto de entrada para cualquier solicitud de desarrollo de software |
| **@architecture-agent** | Guardián de arquitectura | Validar patrones, estructura de carpetas, separación de capas |
| **@backend-agent** | Desarrollador backend | APIs REST, servicios, repositorios, middlewares |
| **@database-agent** | Especialista BD | Tablas, migraciones, índices, stored procedures |
| **@database-validator** | Validador de BD | Verificación de integridad, relaciones y esquemas |
| **@devops-agent** | DevOps/Infra | CI/CD, Docker, despliegue, entornos |
| **@diagram-agent** | Diagramas | Diagramas de arquitectura y flujos (draw.io, Mermaid) |
| **@documentation-agent** | Documentación | READMEs, changelogs, manuales de usuario, OpenAPI |
| **@frontend-agent** | Desarrollador frontend | UI, componentes, integración con APIs, UX |
| **@security-agent** | Seguridad | Auditoría OWASP, JWT, validaciones, CORS |
| **@testing-agent** | Testing | Pruebas unitarias, integración, estrés, diagnóstico |
| **@powerapps-agent** | Power Platform | Low-code apps, conectores, Power Apps |
| **@power-automate-agent** | Automatización | Flujos automatizados, conectores Power Automate |

### Skills de Programación
Disponibles en `.github/skills/programming/`:
`architecture`, `backend-service-gen`, `backend-setup-automation`, `check-compatibility`, `cloudinary-integration`, `document-processing`, `error-handling-strategy`, `frontend-component-bridge`, `merge-mastery`, `node-version-manager`, `security-audit`, `sql-migration`, `sync-db-models`

---

## 🔎 Workflow: Evaluar Estado del Pipeline ML

1. `python setup_and_run.py --mode status --venv-name venv --skip-install`
2. `python setup_and_run.py --mode compat --venv-name venv --skip-install`
3. `python setup_and_run.py --mode run --venv-name venv --skip-install`
4. (Opcional) `python setup_and_run.py --mode smoke-test --venv-name venv --skip-install`

Checklist:
- Artefactos en `data/processed/`, `models/`, `reports/`.
- Métricas con prioridad en recall/F1 por desbalance.
- Verificación contra [docs/verificacion_rubrica_pdf.md](../docs/verificacion_rubrica_pdf.md).

## 🧩 Convención de Fases del Pipeline
- Mapeo pedagógico: 0-5 (audit, prep, unsupervised, optuna, train, report).
- Para coordinación entre agentes, usar siempre el mapeo 0-5.

