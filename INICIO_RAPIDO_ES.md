# ⚡ INICIO RÁPIDO - FadeBooker (5 MINUTOS)

🇪🇸 **BIENVENIDO A FADEBOOKER**

Sigue estos pasos para comenzar en 5 minutos.

---

## 1️⃣ Clonar Repositorio (30 seg)

```bash
git clone <tu-repo>
cd FadeBooker/Producto/back-fadebooker
```

---

## 2️⃣ Instalar Dependencias (2 min)

```bash
npm install
```

---

## 3️⃣ Configurar Variables de Entorno (1 min)

Crear archivo `.env` en `Producto/back-fadebooker/`:

```env
# Base de Datos (CRÍTICO)
DB_SERVER=fadebooker-server.database.windows.net
DB_USER=adminuser
DB_PASSWORD=tu_password_aqui
DB_NAME=FadeBooker_DB
DB_PORT=1433

# Entorno
NODE_ENV=development

# API
API_PORT=3000
```

**Obtén contraseña de:** 🔐 Pide a administrador del proyecto

---

## 4️⃣ Verificar Conexión (1 min)

```bash
node -e "require('./src/db/knex').raw('SELECT 1').then(() => console.log('✅ ¡CONECTADO!')).catch(e => console.error('❌ Error:', e.message))"
```

**Esperado:** 
```
✅ ¡CONECTADO!
```

---

## 5️⃣ Iniciar Servidor (30 seg)

```bash
npm start
```

**Esperado:**
```
✅ Servidor ejecutándose en http://localhost:3000
✅ BD conectada a FadeBooker_DB
```

---

## ✅ Listo para Desarrollar

Ahora puedes:

```bash
# Listar usuarios
curl http://localhost:3000/api/usuarios

# Crear usuario
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

---

## 📖 Próximos Pasos

### Si eres NUEVO en el equipo:
1. Lee: [README_ES.md](README_ES.md) (15 min)
2. Lee: [INSTRUCCIONES_GLOBALES_ES.md](.github/INSTRUCCIONES_GLOBALES_ES.md) (10 min)
3. Lee: [GUIA_AGENTES_ES.md](.github/GUIA_AGENTES_ES.md) (20 min)

### Si eres DESARROLLADOR BACKEND:
1. Abre: `Producto/back-fadebooker/src/`
2. Lee: [REFERENCIA_RAPIDA_ES.md](.github/REFERENCIA_RAPIDA_ES.md) (5 min)
3. Consulta: [.github/agents/backend-agent.md](.github/agents/backend-agent.md)

### Si eres ESPECIALISTA BD:
1. Abre: [Documentación/Material complementario/FadeBooker_ER_3NF.drawio](Documentación/Material%20complementario/FadeBooker_ER_3NF.drawio)
2. Lee: [Documentación/ESPECIFICACION_BD.md](Documentación/ESPECIFICACION_BD.md)
3. Consulta: [.github/agents/database-agent.md](.github/agents/database-agent.md)

---

## 🆘 Problemas Comunes

### ❌ "Cannot connect to database"
```bash
# Verifica .env - especialmente DB_PASSWORD
# Verifica que credenciales sean correctas
cat .env | grep DB_
```

### ❌ "Port 3000 already in use"
```bash
# Cambia puerto en .env
# O termina el proceso anterior
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows
```

### ❌ "npm: command not found"
```bash
# Instala Node.js desde nodejs.org
# Verifica: node --version && npm --version
```

---

## 📚 Documentación Disponible

| Doc | Tiempo | Contenido |
|-----|--------|----------|
| [README_ES.md](README_ES.md) | 15 min | Instalación + estructura |
| [GUIA_AGENTES_ES.md](.github/GUIA_AGENTES_ES.md) | 20 min | Cómo usar agentes |
| [REFERENCIA_RAPIDA_ES.md](.github/REFERENCIA_RAPIDA_ES.md) | 5 min | Comandos útiles |
| [INDICE_DOCUMENTACION_ES.md](.github/INDICE_DOCUMENTACION_ES.md) | 10 min | Navegar docs |

---

## 🤖 Invocar Agentes

Una vez conectado:

```markdown
@backend-agent:
Crear endpoint GET /api/prueba
que devuelve { mensaje: "¡FadeBooker funciona!" }
```

```markdown
@database-agent:
Verificar que tabla Usuario existe con columnas:
id_usuario, email, nombre, apellido, rol
```

---

## ✅ Checklist Primera Corrida

- [ ] ✅ Git cloned
- [ ] ✅ npm install completado
- [ ] ✅ .env creado con credenciales
- [ ] ✅ Conexión a BD verificada
- [ ] ✅ npm start ejecutándose
- [ ] ✅ curl a /api/usuarios respondiendo
- [ ] ✅ Documentación inicial leída

---

## 🎯 Objetivo Hoy

**Meta:** Que puedas hacer una pequeña tarea coordinando con un agente.

**Tarea sugerida:**
```
@orchestrator-agent: [COMPLETE]
Quiero crear un endpoint GET /api/version 
que devuelva { version: "1.0.0", environment: "development" }

Coordina: Backend Agent → Documentation → Validation
```

---

## 📞 Contacto/Ayuda

- **Problemas de instalación:** Enviame mensaje
- **Issues del código:** Abre issue en GitHub
- **Preguntas sobre agentes:** Lee GUIA_AGENTES_ES.md

---

## 🚀 Listo para Comenzar

**¡Bienvenido al equipo FadeBooker!**

Ahora tienes todo configurado. 

**Próximo paso:** Leer [README_ES.md](README_ES.md) para entender la arquitectura completa.

---

**Última actualización:** 14 de abril de 2026  
**Tiempo para completar:** ⏱️ ~5-10 minutos  
🇪🇸 **ESPAÑOL**
