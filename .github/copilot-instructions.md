# 🎯 Reglas de Operación — Ciencia de Datos

---

## 🎓 Sistema de Estudio — Asignaturas del Semestre

### Agente de entrada global: `@system-orchestrator`
Para cualquier solicitud general en el repositorio, usar este orden de delegación:
1. `@system-orchestrator` clasifica la solicitud (PUNTO DE ENTRADA ÚNICO)
2. `@study-orchestrator` atiende material, dudas y evaluaciones del curso
3. `@data-orchestrator` atiende pipeline EDA-ACV y artefactos de ML
4. `@programming-orchestrator` atiende desarrollo de software: APIs, BD, frontend, tests, docs, arquitectura

### Agente de entrada: `@study-orchestrator`
Para cualquier solicitud relacionada con el estudio, usar este orden de delegación:
1. `@study-orchestrator` identifica la necesidad y delega
2. `@content-reader` lee el knowledge base en `knowledge/`
3. `@preprocesamiento-tutor` o `@programacion-tutor` responde según la asignatura
4. `@quiz-generator` genera evaluaciones o práctica

### Protocolo para solicitudes de estudio
Cuando el usuario pida resumir, explicar, preguntar o evaluar:
1. Verificar si `knowledge/` existe → si no, guiar al usuario a ejecutar el script de extracción
2. Buscar el tema en `knowledge/INDEX.md`
3. Leer el archivo `.md` correspondiente
4. Delegar al tutor especialista o quiz-generator según la solicitud

### Inicializar el Knowledge Base (ejecutar UNA sola vez)
```bash
pip install -r scripts/requirements_extraction.txt
python scripts/extract_course_content.py
```

### Asignaturas disponibles
| Asignatura | Carpeta en `knowledge/` |
|---|---|
| Preprocesamiento de Datos | `PREPROCESAMIENTO de datos/` |
| Programación para Ciencia de Datos | `Programación para ciencia de datos/` |
| Inferencia Estadística | `Inferencia Estadística/` |
| Herramientas de Cálculo Diferencial | `Herramientas de calculo diferencial/` |

---

## 🔬 Reglas de Operación — Pipeline EDA-ACV (Fase 2 Modelado)

## 🧬 Contexto y Referencia
Este proyecto sigue la metodología modular de [codon-classification-pipeline](https://github.com/trigoduoc/codon-classification-pipeline). Todo el desarrollo debe alinearse con la estructura de 6 fases (0-5).

## 🤖 Roles de Agente
Consulta [.github/AGENTS.md](.github/AGENTS.md) para identificar qué agente debe realizar cada tarea. No ignores los límites de responsabilidad de cada rol.

### Jerarquía Operativa
- `@system-orchestrator` decide el subsistema (nivel 1 — entrada única).
- `@study-orchestrator` coordina el sistema educativo (nivel 2).
- `@data-orchestrator` coordina el pipeline de ML (nivel 2).
- `@programming-orchestrator` coordina el desarrollo de software (nivel 2).
- Los agentes especialistas solo ejecutan tareas concretas dentro de su dominio (nivel 3).

### Estructura de Custom Agents
- Orquestador principal: `.github/system-orchestrator.agent.md`
- Agentes de estudio: `.github/agents/study/*.agent.md`
- Agentes de data: `.github/agents/data/*.agent.md`
- Agentes de programación: `.github/agents/programming/*.agent.md`
- Agentes de soporte: `.github/agents/support/github-git-agent.md`
- Skills de programación: `.github/skills/programming/*.md`
- Instructions: `.github/instructions/*.instructions.md`

## 🧭 Jerarquía de Instrucciones
- Primero: perfiles especializados en `.github/agents/*.agent.md`.
- Segundo: mapa de roles y carpetas en `.github/AGENTS.md`.
- Tercero: estas reglas globales en `.github/copilot-instructions.md`.
- Si hay conflicto, prima la instrucción más específica al archivo o tarea.

## 📁 Estructura del Código
- **`src/`**: Dividido en subcarpetas numeradas por fase (`0_audit` a `5_report`).
- **Scripts**: Cada fase debe tener un script orquestador o notebook de ejecución.
- **Data**: 
  - `data/raw/`: INMUTABLE. No abrir para escritura.
  - `data/processed/`: Salida de procesos de limpieza y transformación.

## 🛠 Stack Tecnológico
- **Core**: Python 3.x, pandas, scikit-learn.
- **Modelado**: xgboost, lightgbm, optuna.
- **Visualización**: matplotlib, seaborn, yellowbrick.

## 🚀 Comandos Críticos
- Inicializar estructura: `python3 setup_and_run.py`
- Instalación: `pip install -r requirements.txt`

## ✅ Protocolo Para Evaluar Estado Del Proyecto
Cuando el usuario pida "evaluar cómo está el proyecto" o "ejecutarlo para validar estado", usar este orden:

1. Estado general (sin ejecución completa):
  - `python setup_and_run.py --mode status --venv-name venv --skip-install`
2. Compatibilidad del entorno:
  - `python setup_and_run.py --mode compat --venv-name venv --skip-install`
3. Ejecución end-to-end del pipeline:
  - `python setup_and_run.py --mode run --venv-name venv --skip-install`
4. Verificación rápida opcional:
  - `python setup_and_run.py --mode smoke-test --venv-name venv --skip-install`

Reportar resultados con foco en:
- Métricas finales y trade-off recall/precision.
- Artefactos generados en `data/processed/`, `models/` y `reports/`.
- Brechas detectadas respecto de [docs/verificacion_rubrica_pdf.md](../docs/verificacion_rubrica_pdf.md).

## � Dominio de Programación — Desarrollo de Software
Cuando el usuario pida crear un programa, API, base de datos, frontend, documentación técnica, diagramas de arquitectura o ejecutar tests:
1. `@system-orchestrator` detecta la solicitud como programación
2. Delega a `@programming-orchestrator`
3. `@programming-orchestrator` coordina a los agentes especialistas: `@backend-agent`, `@database-agent`, `@frontend-agent`, `@architecture-agent`, `@testing-agent`, `@security-agent`, `@documentation-agent`, etc.
4. Para commits, `@github-git-agent` (en `agents/support/`) solicita confirmación antes de persistir

### Stack de programación disponible
- Node.js (Express, Hexagonal Architecture, Zod)
- React / Vue (Feature-Based Architecture)
- SQL Server / PostgreSQL / SQLite
- Docker, Azure, CI/CD
- Power Platform (Power Apps, Power Automate)
- Python (scripts, CLI, ML)

## 👥 Definiciones Detalladas
Los perfiles de agentes individuales se encuentran en:
- [.github/agents/study/](.github/agents/study/) — tutores y sistema educativo
- [.github/agents/data/](.github/agents/data/) — pipeline ML
- [.github/agents/programming/](.github/agents/programming/) — desarrollo de software
- [.github/agents/support/](.github/agents/support/) — soporte compartido (git)
- [.github/AGENTS.md](.github/AGENTS.md) — mapa completo del ecosistema
