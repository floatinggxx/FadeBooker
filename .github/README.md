# 🤖 FadeBooker Agent Architecture

This directory contains the customization and coordination files for the FadeBooker agent ecosystem.

## 📁 File Structure

```
.github/
├── copilot-instructions.md    # Global conventions, stack, and principles
├── AGENTS.md                  # Central registry and status of all agents
├── agents/
│   ├── orchestrator-agent.md  # Multi-agent coordination and workflow
│   ├── database-agent.md      # SQL Server schema and migrations
│   ├── backend-agent.md       # Node.js APIs and business logic
│   ├── frontend-agent.md      # React UI and user experience
│   ├── documentation-agent.md # Technical and user documentation
│   ├── diagram-agent.md       # Architecture and flow visualization
│   └── security-agent.md      # Code audits and security standards
└── README.md                  # This file
```

## 🎯 Quick Reference

| File | Purpose | Audience |
|------|---------|----------|
| [copilot-instructions.md](copilot-instructions.md) | **Global conventions:** Stack, naming, principles, Git workflow | All agents |
| [AGENTS.md](AGENTS.md) | **Agent registry & status:** Who does what, current phase, coordination rules | All agents, orchestrator |
| [agents/\*-agent.md](agents/) | **Detailed agent instructions:** Domain expertise, responsibility, examples | Specific agent only |

## 🚀 How to Invoke Agents

From any chat in VS Code, invoke an agent with `@agent-name`:

```markdown
@database-agent: Create table Users with fields: id (UUID), email, nombre, createdAt

@backend-agent: Generate CRUD endpoints for Users at /api/users with validation

@documentation-agent: Document the /api/users endpoints in README

@diagram-agent: Add Users table to ER diagram and show auth flow

@orchestrator-agent: Coordinate complete feature implementation for "User Authentication"

@security-agent: Audit backend for OWASP Top 10 vulnerabilities and JWT standards

@frontend-agent: Create user management page with React + TypeScript
```

## 📊 Project Status

**Latest Update:** April 28, 2026 | **Version:** 1.1.0

| Agent | State | Progress | Next Steps |
|:------|:------|:----------|:-----------|
| Database | ✅ Complete | 100% | Deploy to Azure, CI/CD pipeline |
| Backend | ✅ Complete | 92% | Finish E2E tests, production deployment |
| Documentation | ✅ Complete | 100% | Maintenance mode |
| Diagram | ✅ Complete | 100% | Keep in sync with changes |
| **Security** | 🆕 Active | 0% | Audit backend, define JWT/CORS standards |
| **Frontend** | 🆕 Starting | 0% | Migrate Power Pages → React |
| Orchestrator | ✅ Active | — | Coordinate all agents |

## 🔗 Related Documentation

- **Project Overview:** [README.md](../README.md)
- **Codebase Structure:** [CODEBASE_STRUCTURE.md](../CODEBASE_STRUCTURE.md)
- **Database Design:** [BD_Diseño_3NF.txt](../Documentación/Documentos/BD_Diseño_3NF.txt)
- **Backend & Frontend:** [Producto/](../Producto/)

## 🛠️ Agent Responsibilities at a Glance

### 🗄️ Database Agent
- Define schema, migrations, indexes, constraints
- Source of truth: SQL scripts in version control
- Coordinates with Backend Agent for model alignment

### 🔧 Backend Agent
- Implement API endpoints and business services
- Follow clean architecture (domain, application, infrastructure)
- Coordinates with Security Agent for auth/CORS standards

### 🎨 Frontend Agent
- Build React components and user workflows
- Migrate from Power Pages to React
- Coordinates with Backend Agent for API integration

### 📋 Documentation Agent
- Document APIs, architecture, deployment
- Keep docs in sync with implementation
- Single source of truth for user and technical guides

### 📐 Diagram Agent
- Maintain ER diagrams, architecture diagrams, flow diagrams
- Keep visuals synchronized with code changes
- Uses draw.io format for version control

### 🔐 Security Agent
- Audit code for OWASP standards
- Define authentication and authorization patterns
- Review all critical changes before merge

### 🎛️ Orchestrator Agent
- Coordinate multi-agent workflows
- Validate consistency across domains (DB ↔ Backend ↔ Docs ↔ Diagrams)
- Report project status and remove blockers

---

**For detailed instructions, see:** [AGENTS.md](AGENTS.md)
