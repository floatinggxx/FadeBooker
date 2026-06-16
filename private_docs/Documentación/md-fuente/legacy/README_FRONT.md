# FadeBooker Frontend Project

Este es el frontend de **FadeBooker**, desarrollado con React, Vite y TypeScript.

## 🚀 Tecnologías

- **Framework:** React 18
- **Construcción:** Vite
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Estado Global:** Zustand / Context API
- **Routing:** React Router v6
- **HTTP Client:** Axios + React Query

## 🛠️ Estructura de Carpetas

Sigue una arquitectura basada en **features** para escalabilidad:

- `src/components/ui`: Componentes base reutilizables (Botones, Inputs, etc.)
- `src/features`: Lógica de negocio dividida por dominios (auth, citas, barberos).
- `src/lib`: Configuraciones de librerías externas (axios, queryClient).
- `src/styles`: Estilos globales y tokens de diseño.

## 🏁 Inicio Rápido

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Configurar variables de entorno:
   ```bash
   cp .env.example .env
   ```
3. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```
