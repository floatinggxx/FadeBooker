# Copilot Workspace Instructions

## Context
Este repositorio es un backend en Node.js para FadeBooker, un sistema de agendamiento de barberías.

### Tecnologías principales
- Node.js
- Express
- Knex.js
- SQL Server (`tedious`)

### Arquitectura
El código usa una estructura inspirada en una arquitectura limpia/hexagonal:
- `src/domain/entities`: modelos de dominio (`Usuario`, `Cliente`, `Barbero`, `Cita`, `Servicio`, etc.)
- `src/domain/repositories`: contratos de repositorio (interfaces) para persistencia
- `src/application/usecases`: servicios de aplicación / casos de uso
- `src/infraestructure/database`: implementaciones concretas de repositorios con Knex
- `src/interfaces/http`: controladores y rutas HTTP

## Qué debe hacer este agente
- Prioriza la separación de capas y respeta la estructura actual.
- Usa el estilo de nombres en español que ya emplea el proyecto (`Usuario`, `Cita`, `Barbero`, `Cliente`).
- Evita mezclar lógica de negocio con acceso a datos.
- Si agregas funcionalidades nuevas, pon la lógica de dominio en `src/application/usecases` y deja los detalles de DB en `src/infraestructure/database`.

## Problemas importantes detectados
- `package.json` define `main: "index.js"` y `scripts.start` ejecutan `node index.js`, pero no hay `index.js` en la raíz.
- El servidor principal actual parece estar en `src/app.js`.
- No hay README ni pruebas automatizadas.

## Cómo ejecutar o probar cambios
1. Instala dependencias: `npm install`
2. Verifica el archivo de arranque real; probablemente `node src/app.js` o crea `index.js` que importe `src/app.js`.
3. La configuración de Knex está en `src/config/knexfile.js` y usa SQL Server local.

## Estilo de respuesta
- Sé directo y en español.
- Explica brevemente qué cambiaste y por qué.
- Si algo es un supuesto (por ejemplo, nombres de tablas en la BD), indícalo claramente.

## Ejemplos de solicitud útiles
- "Corrige la conexión de Knex y crea el repositorio de Usuario." 
- "Implementa el controlador de citas usando el servicio y el repositorio." 
- "Haz que el backend pueda registrar y autenticar usuarios con contraseñas hasheadas."

## Preguntas frecuentes para el usuario
- "¿Quieres que cree un archivo `index.js` en la raíz o que actualicemos `package.json` al archivo real de arranque?"
- "¿Prefieres que la lógica de autenticación use `bcrypt` o que sigamos con comparaciones simples por ahora?"
