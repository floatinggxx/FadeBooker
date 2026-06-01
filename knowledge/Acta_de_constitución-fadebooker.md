# Acta de constitución-fadebooker.docx

> **Fuente:** `Documentos/Acta de constitución-fadebooker.docx.pdf`  
> **Tipo:** `.PDF`  
> **Tamaño:** `107.4 KB`

---

### Página 1

Acta de Constitución del Proyecto: Fade Booker
Fecha: 24 de marzo de 2026
Ciudad: Santiago, Chile
1. Autorización y Propósito
Mediante el presente documento, se autoriza formalmente el inicio del proyecto
Fade Booker. El propósito es desarrollar una plataforma digital integral para la
gestión de barberías y peluquerías que optimice el agendamiento de citas, reduzca
el ausentismo mediante un sistema de pagos con retención, fidelice a los clientes a
través de un sistema de puntos y valoraciones, y facilite la administración de
recursos para dueños y barberos, incorporando como valor diferencial un módulo de
simulación de cortes mediante inteligencia artificial.
El proyecto responde a una problemática real identificada por un integrante del
equipo que trabaja en el rubro, donde la falta de herramientas tecnológicas
especializadas genera pérdida de citas, sobre-reservas, alto ausentismo y nulo
historial de clientes.
2. Objetivos y Criterios de Éxito
Objetivo General:
Implementar un sistema de gestión y reserva de citas con simulación de estilo
mediante inteligencia artificial para barberías y peluquerías, que permita reducir el

### Página 2

ausentismo en un 40% y aumentar las reservas confirmadas en un 30% en un plazo
de 16 semanas.
Objetivos Específicos:
1. Desarrollar un motor de búsqueda de barberías por geolocalización en tiempo
real, permitiendo a los clientes encontrar establecimientos cercanos según su
ubicación.
2. Integrar un módulo de simulación de cortes de cabello mediante
procesamiento de imágenes, donde el cliente pueda subir una foto y
visualizar diferentes estilos antes de reservar, con un mensaje de alerta sobre
la naturaleza referencial de la simulación.
3. Establecer un sistema de pagos con retención de abonos mediante Mercado
pago, configurable entre el 30% y el 100% del valor del servicio, que permita
reducir el ausentismo al penalizar económicamente las cancelaciones tardías
o las inasistencias.
4. Implementar un sistema de fidelización mediante puntos acumulables por
cada reserva confirmada, canjeables por descuentos o servicios gratuitos.
5. Diseñar un panel administrativo para dueños que permita gestionar barberos,
visualizar estadísticas de reservas e ingresos, y administrar promociones.
6. Desarrollar una aplicación de gestión para barberos en Power Apps que
permita visualizar agenda diaria, confirmar o cancelar citas, y registrar
servicios realizados.
Criterios de Éxito:
● Cumplimiento del cronograma establecido en la Carta Gantt, finalizando la
totalidad de las fases el 02 de junio de 2026.
● Aprobación de las pruebas de usuario con barberos reales, alcanzando un Net
Promoter Score superior a 50.
● Despliegue final sin errores críticos en los flujos principales de reserva, pago y
simulación de cortes.
● Correcta integración de la arquitectura hexagonal con Express.js, React y
Power Platform, demostrando separación de capas y mantenibilidad del
código.
● Cobertura de pruebas unitarias superior al 70% en los módulos críticos de
reservas y pagos.

### Página 3

3. Alcance del Proyecto
Incluye:
● Registro de usuarios con roles diferenciados: cliente, barbero, dueño de local,
proveedor y administrador.
● Agendamiento asíncrono de citas con selección de barbero, fecha, hora y
servicio, mostrando disponibilidad en tiempo real.
● Pagos electrónicos mediante Mercado pago con retención de abono hasta la
confirmación del servicio.
● Simulación de cortes mediante inteligencia artificial, con subida de foto,
generación de diferentes estilos y adjunto automático a la reserva.
● Sistema de puntos por lealtad acumulables con cada reserva confirmada.
● Valoraciones post-servicio con puntuación de 1 a 5 estrellas y comentarios.
● Panel administrativo para dueños con estadísticas de reservas, ingresos,
valoración promedio y tasa de ausentismo.
● Aplicación Power Apps para barberos con gestión de agenda diaria.
● Notificaciones automáticas por correo electrónico para confirmaciones y
recordatorios.
● Documentación técnica completa y manual de usuario.
No incluye:
● Liquidación de sueldos o gestión de planillas legales para empleados de
barberías.
● Gestión de contratos de personal o procesos de selección.
● Venta de productos con logística de envío externa (e-commerce complejo).
● Aplicación nativa para iOS o Android (solo web responsive y Power Apps).
● Integración con otros sistemas de pago distintos a Stripe en esta fase.
4. Equipo de Trabajo y Roles
De acuerdo a la estructura de trabajo definida para el proyecto, el equipo se organiza
con los siguientes roles y responsabilidades:

### Página 4

Rol Nombre Responsabilidades
Jefe de Proyecto / Steve Alexander Lazaro Coordinación general del
Analista / Diseñador Terrones equipo, seguimiento de
hitos en Jira, diseño de
UI/UX en Figma (baja y
alta fidelidad), análisis de
requerimientos, gestión
de riesgos
QA / Testing / Nicolás Antonio Vallejos Pruebas unitarias y de
Desarrollador Aravena integración (Vitest,
Supertest), desarrollo
frontend y backend,
investigación técnica de
simulación IA, mercado
pago, Cloudinary,
Express.js, Knex.js, JWT
Analista / Diseñador Fernanda Soledad Levantamiento de
Gonzalez Manzo requerimientos
funcionales y no
funcionales, definición de
historias de usuario con
criterios de aceptación,
priorización del backlog,
diseño de mockups

### Página 5

DBA / Desarrollador / Mauricio Alejandro Tapia Diseño de base de datos
Project Manager Ayala SQL Server, desarrollo
backend (API),
documentación técnica,
planificación en carta
Gantt, gestión de
repositorio GitHub
5. Recursos y Plazos Clave
Recursos Técnicos:
Categoría Herramientas / Tecnologías
Desarrollo Frontend React con TypeScript,Vite, Azure Static Web Apps
, Axios, Tailwind CSS o Bootstrap
Desarrollo Backend Node.js, Express.js, Azure App Service, Knex.js,
JWT
Base de Datos SQL Server (Developer Edition para desarrollo,
Azure SQL para despliegue)
Pagos Mercado Pago API con webhooks

### Página 6

Simulación IA Cloudinary o Azure AI Vision (en evaluación)
Pruebas Vitest, Supertest, React Testing Library, Postman
Infraestructura Azure (App Service, SQL Serverless, Static Web
Apps).
Gestión de Código GitHub con estrategia de ramas GitFlow
simplificado
Gestión de Proyecto Jira para seguimiento de tareas
Diseño Canva para prototipos de baja fidelidad y Figma
para prototipos de alta fidelidad
Comunicación WhatsApp, Discord
Cronograma de Hitos:
Hito Fecha de Finalización Entregable
Levantamiento de 16 de marzo de 2026 Documento de
Requerimientos y requerimientos,
Arquitectura arquitectura definida,
stack tecnológico
seleccionado

### Página 7

Diseño de Base de Datos 30 de marzo de 2026 Modelo entidad-relación,
y API scripts SQL,
documentación
Swagger/OpenAPI
Evaluación 1 del Proyecto 31 de marzo al 07 de abril Informe de Avance N°1:
de 2026 Estrategia y
Conceptualización,
presentación al docente
Desarrollo Core (API y 27 de abril de 2026 API funcional con
Frontend) endpoints de reservas,
frontend React integrado
con Azure Static Web
Apps
Pruebas y Correcciones Mayo de 2026 Reporte de pruebas
unitarias e integración,
feedback de usuarios
Presentación Final 02 de junio de 2026 Proyecto completo
(Evaluación 2) desplegado,
documentación técnica,
manual de usuario, video
demo
6. Restricciones y Supuestos

### Página 8

Restricciones:
● Presupuesto de $0 USD para licencias, utilizando exclusivamente capas
gratuitas de Azure, SQL Server Developer Edition, y créditos para estudiantes.
● Plazo de 16 semanas para la entrega final, alineado con el semestre
académico.
● La precisión de la simulación de cortes está limitada por la tecnología
disponible; se implementará un disclaimer informativo para el usuario.
● Solo Mercado Pago será utilizado como pasarela de pagos en esta fase.
Supuestos:
● Se cuenta con acceso al programa Microsoft 365 Developer Program con
entornos gratuitos.
● Se dispone de cuenta Azure con créditos gratuitos para estudiantes por $100
USD.
● Mercado Pago proporciona modo sandbox sin costo para desarrollo.
● Los usuarios finales (barberías) tienen acceso a internet y dispositivos
básicos.
● El equipo dispone de 10 a 15 horas semanales por integrante para el
desarrollo.
● Cloudinary ofrece una capa gratuita suficiente para almacenamiento de
imágenes de prueba.
● La API de simulación de cortes seleccionada cuenta con capa gratuita o
demo para desarrollo.
7. Aprobaciones
El presente documento constituye la autorización formal para el inicio del proyecto
Fade Booker y será utilizado como referencia para la planificación, ejecución y
control de todas las actividades del equipo.
Firma de Autorización:

### Página 9

Steve Alexander Lazaro Terrones
Jefe de Proyecto
Fade Booker
Nicolás Antonio Vallejos Aravena
QA / Testing / Desarrollador
Fernanda Soledad Gonzalez Manzo
Analista / Diseñador
Mauricio Alejandro Tapia Ayala
DBA / Desarrollador / Project Manager