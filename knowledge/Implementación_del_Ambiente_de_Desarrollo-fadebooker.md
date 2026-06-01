# Implementación del Ambiente de Desarrollo-fadebooker

> **Fuente:** `Documentos/Implementación del Ambiente de Desarrollo-fadebooker.docx`  
> **Tipo:** `.DOCX`  
> **Tamaño:** `1720.2 KB`

---

# Documento de Implementación del Ambiente de Desarrollo

Proyecto: Fade Booker - Sistema de Gestión de Barberías con Simulación de Estilo mediante IA
Arquitectura: Hexagonal (Puertos y Adaptadores)
Fecha: Abril 2026
Responsable: Equipo Fade Booker

## 1. Introducción

El presente documento describe la implementación del ambiente de desarrollo del proyecto FadeBooker. Su propósito es detallar la configuración e integración de los distintos componentes tecnológicos utilizados en la solución, incluyendo base de datos, backend, frontend, automatizaciones y servicios externos.

El ambiente de desarrollo fue diseñado siguiendo los principios de la arquitectura hexagonal (Puertos y Adaptadores), permitiendo separar la lógica de negocio de las dependencias externas y facilitando la mantenibilidad, escalabilidad y testabilidad del sistema.

La solución utiliza tecnologías modernas basadas en JavaScript y servicios cloud de Microsoft Azure, complementados con herramientas especializadas como Stripe y Cloudinary para pagos y almacenamiento de imágenes.

## 2. Diagrama de Arquitectura de Referencia

La siguiente imagen muestra el esquema general de la arquitectura implementada, donde se distinguen las capas de adaptadores de entrada, puertos, núcleo de negocio, y adaptadores de salida.

Descripción del flujo:

Los adaptadores de entrada (React SPA y Power Apps) reciben las solicitudes de los usuarios y las envían al backend mediante endpoints HTTP seguros.

Estas solicitudes son canalizadas hacia el núcleo de negocio a través de los puertos de entrada, donde se ejecutan las reglas de negocio definidas por el sistema.

Cuando el núcleo requiere persistencia de datos, procesamiento de pagos o almacenamiento de imágenes, utiliza los puertos de salida para comunicarse con sus respectivos adaptadores externos (SQL Server, Mercado pago y Cloudinary).

La autenticación se gestiona mediante JSON Web Tokens (JWT), permitiendo validar las solicitudes y controlar el acceso según roles definidos dentro del sistema.

## 3. Componentes del Ambiente de Desarrollo

### 3.1. Base de Datos: Azure SQL Database

Tecnología: Azure SQL Database (Serverless)

Implementación:

Entorno Local (Desarrollo): Se utilizó un contenedor Docker con SQL Server 2022 Developer Edition para el desarrollo inicial. La configuración se realizó mediante variables de entorno (ACCEPT_EULA=Y, MSSQL_SA_PASSWORD, MSSQL_PID=Developer) y persistencia de datos a través de volúmenes de Docker.

Entorno en la Nube (Azure): La base de datos fue migrada a Azure SQL Database en la región brazilsouth. Se utilizó el modelo Serverless para optimizar costos, con pausa automática tras 1 hora de inactividad. La migración de los datos se realizó mediante la exportación de la base de datos local a un archivo .bacpac y su posterior importación a Azure.

Configuración final en Azure:

### 3.2. Backend: API en azure app service (node.js)

Tecnología: Node.js, Express.js, Knex.js, Azure App Service

Implementación:

Backend Local:

La API se desarrolla utilizando Node.js y Express.js, empleando Knex.js como query builder para interactuar con la base de datos SQL Server. Las pruebas unitarias y de integración se realizan con Vitest y Supertest.

Despliegue en Azure:

La API se despliega mediante Azure App Service, permitiendo alojar la aplicación backend en un entorno cloud administrado por Microsoft Azure. Este servicio proporciona alta disponibilidad, integración con GitHub para despliegue continuo y soporte para aplicaciones Node.js.

La comunicación entre frontend y backend se realiza mediante endpoints REST protegidos con autenticación JWT. Cadena de conexión a la base de datos (variable de entorno):

ini

DB_CONNECTION=Server=fadebooker-server.database.windows.net;Database=FadeBooker_DB;User Id=adminuser;Password=F4deBooker.2026;

### 3.3. Frontend: React, Vite, TypeScript, Axios, Power Apps

Tecnología: React, Vite, TypeScript, Axios

Implementación:

La interfaz principal para clientes se desarrolla utilizando React junto con Vite como herramienta de construcción y servidor de desarrollo. TypeScript se utiliza para proporcionar tipado estático y mejorar la mantenibilidad del código.

La aplicación React funciona como una Single Page Application (SPA), permitiendo navegación dinámica y una experiencia fluida para los usuarios. Axios se utiliza para la comunicación con la API backend desplegada en Azure App Service mediante endpoints protegidos con JWT.

El frontend se despliega como aplicación web estática, aprovechando hosting cloud con soporte para HTTPS y despliegue automatizado desde GitHub.

Adicionalmente, Power Apps se utiliza como interfaz administrativa para barberos y dueños de barberías, permitiendo gestionar reservas, disponibilidad y clientes mediante una aplicación de rápida implementación e integración con el ecosistema Microsoft.

### 3.4. Automatización: Power Automate

Tecnología: Power Automate (Cloud Flows)

Implementación:

Flujo de Notificaciones: Se creó un flujo automatizado que se dispara tras la creación de una reserva. Este flujo envía un correo electrónico de confirmación al cliente con los detalles de la cita y un enlace para gestionar la reserva.

Flujo de Webhooks de Stripe: Se implementó un flujo que recibe webhooks de Stripe cuando un pago es confirmado o falla. Este flujo actualiza el estado de la reserva en la base de datos (vía HTTP request a la API backend) y notifica al barbero.

### 3.5. Agente de IA: Copilot Studio

Tecnología: Microsoft Copilot Studio

Implementación:

Agente de Soporte al Cliente: Se configuró un agente de IA en Copilot Studio para responder preguntas frecuentes sobre el proceso de reserva, políticas de cancelación y métodos de pago. El agente se integró a la aplicación web mediante el conector de Power Virtual Agents.

Tópicos y Entidades: Se definieron tópicos como "¿Cómo reservar una cita?", "¿Cuál es la política de cancelación?" y "¿Cómo simular un corte?". Se utilizaron entidades predefinidas para extraer información de las consultas de los usuarios.

Autenticación: El agente se configuró para autenticar a los usuarios y, en el futuro, se planea integrarlo con la API backend para realizar acciones como consultar el estado de una reserva.

## 4. Configuración del Entorno de Desarrollo Local

Para replicar el ambiente de desarrollo local, se requieren las siguientes herramientas y configuraciones:

Clonar el repositorio: git clone https://github.com/floatinggxx/FadeBooker.git

Configurar la base de datos local con Docker:

bash

docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=F4deBooker.2026" -e "MSSQL_PID=Developer" -p 1433:1433 --name fadebooker_sql -v sqlvolume:/var/opt/mssql -d mcr.microsoft.com/mssql/server:2022-latest

Ejecutar migraciones de base de datos:

bash

npx knex migrate:latest --knexfile backend/knexfile.js

Ejecutar el backend:

bash

cd backend

npm install

npm run dev

Ejecutar el frontend:

bash

cd frontend

npm install

npm run dev

## 5. Conclusión

El ambiente de desarrollo del proyecto Fade Booker ha sido implementado exitosamente siguiendo una arquitectura moderna y desacoplada. Se ha logrado:

Integración continua: Cada componente (BD, Backend, Frontend) se despliega de forma independiente.

Costos optimizados: Uso de servicios cloud administrados y contenedores para reducir costos operativos y facilitar el despliegue del sistema.

Seguridad:Autenticación basada en JWT y comunicación cifrada mediante HTTPS.

Automatización: Flujos de negocio automatizados con Power Automate.

Experiencia de usuario: Asistencia inteligente mediante un agente de IA en Copilot Studio.

Este ambiente proporciona una base sólida para el desarrollo, pruebas y despliegue de la solución Fade Booker, asegurando la calidad, escalabilidad y mantenibilidad del software.