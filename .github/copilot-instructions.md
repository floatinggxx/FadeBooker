# 🎯 Reglas de Operación — FadeBooker (Sistema Inteligente de Gestión)

---

## 🎓 Sistema de Estudio y Documentación del Proyecto

### Agente de entrada global: @system-orchestrator
Para cualquier solicitud general en el repositorio, usar este orden de delegación:
1. @system-orchestrator clasifica la solicitud (PUNTO DE ENTRADA ÚNICO)
2. @study-orchestrator atiende material, dudas sobre el proyecto, requerimientos y documentación
3. @data-orchestrator atiende análisis de datos, reportes de negocio y métricas de barbería
4. @programming-orchestrator atiende desarrollo de software: APIs (Node.js), BD (Azure SQL), Frontend (React), tests, docs y arquitectura

### Agente de entrada: @study-orchestrator
Para cualquier solicitud relacionada con la comprensión del proyecto:
1. @study-orchestrator identifica la necesidad y delega
2. @content-reader lee el knowledge base en knowledge/ (donde reside el Acta de Constitución, Planes de Riesgo, etc.)
3. Genera resúmenes técnicos o responde dudas sobre los requerimientos del cliente

### Protocolo para solicitudes de conocimiento
Cuando el usuario pida resumir requerimientos, explicar planes o consultar la arquitectura:
1. Verificar si knowledge/ existe (generado a partir de Documentación/Documentos/)
2. Buscar el tema en knowledge/INDEX.md
3. Leer el archivo correspondiente y responder con precisión quirúrgica

### Inicializar el Knowledge Base de FadeBooker
\`\`\`bash
# Ubicación: Producto/back-fadebooker/
pip install -r scripts/requirements_extraction.txt
python scripts/extract_course_content.py --source "../../Documentación/Documentos" --output "../../knowledge"
\`\`\`

---

## 🔬 Reglas de Operación — Desarrollo y Calidad (FadeBooker)

## 🧬 Contexto y Referencia
Este proyecto sigue una arquitectura **Hexagonal (Clean Architecture)** en el backend y **Feature-Based Architecture** en el frontend. Todo desarrollo debe alinearse con estos patrones.

## 🤖 Roles de Agente
Consulta [.github/AGENTS.md](.github/AGENTS.md) para identificar qué agente debe realizar cada tarea.

### Jerarquía Operativa
- @system-orchestrator decide el subsistema.
- @programming-orchestrator coordina el desarrollo de software (Backend, Frontend, DB).
- @data-orchestrator coordina el análisis de métricas y reportes.
- @study-orchestrator facilita la navegación por la documentación técnica y administrativa.

### Estructura de Custom Agents
- Orquestador principal: .github/system-orchestrator.agent.md
- Agentes de programación: .github/agents/programming/
- Agentes de estudio/docs: .github/agents/study/
- Agentes de soporte: .github/agents/support/
- Skills y Instructions: .github/skills/ y .github/instructions/

## 🧭 Jerarquía de Instrucciones
1. Perfiles especializados en .github/agents/.
2. Mapa de roles en .github/AGENTS.md.
3. Estas reglas globales en .github/copilot-instructions.md.

## 📁 Estructura del Código
- **Backend**: Producto/back-fadebooker/src/ (Domain, Application, Infrastructure, Interfaces).
- **Frontend**: Producto/front-fadebooker/src/ (features, components, hooks, services).
- **Documentación**: Documentación/ y knowledge/.

## 🛠 Stack Tecnológico
- **Core**: Node.js 20, React 18, Vite.
- **Base de Datos**: Azure SQL Server, Knex.js.
- **Integraciones**: Mercado Pago v2, Cloudinary, Gmail (SMTP).

## ✅ Protocolo de Validación
Al evaluar el estado del proyecto, verificar:
1. Conectividad local con .env.
2. Ejecución de tests: npm test en el backend.
3. Sincronización de migraciones en Documentación/Documentos/Migrations/.

## 💻 Dominio de Programación
Cuando el usuario pida cambios en el código:
1. @system-orchestrator delega a @programming-orchestrator.
2. Se coordina al especialista: @backend-agent, @frontend-agent, @database-agent, etc.
3. Para persistir cambios, el @github-git-agent solicita confirmación del commit.

### Estándares de Código
- Tipado estricto (donde aplique) y validación con **Zod**.
- Documentación OpenAPI (Swagger) siempre actualizada.
- Manejo de errores centralizado y registro de logs de auditoría.

### Reglas de Negocio Críticas
- **Pagos**: No permitir agendar sin abono de retención (30-100% vía Mercado Pago).
- **Entidades**: Usar `ServicioBarbero` para la lógica de precios y tiempos (no `ServicioTienda`).
- **Fidelización**: 50 puntos por cada cita completada satisfactoriamente.
- **Seguridad**: Passwords SIEMPRE hasheadas con bcrypt (validar en `UsuarioRepository`).
