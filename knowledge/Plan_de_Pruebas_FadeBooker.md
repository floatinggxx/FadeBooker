# Plan de Pruebas FadeBooker

> **Fuente:** `Documentos/Plan de Pruebas FadeBooker.docx`  
> **Tipo:** `.DOCX`  
> **Tamaño:** `1644.3 KB`

---

Proyecto FadeBooker

Plan de Pruebas

Preparado por: Nicolás Vallejos

Introducción

Este plan de pruebas define la estrategia para validar la plataforma de agendamiento de barberías con simulación de cortes de cabello mediante inteligencia artificial. El objetivo es asegurar la calidad funcional del sistema, el correcto cumplimiento de los requerimientos y la adecuada integración entre los distintos módulos (usuarios, reservas, pagos, IA, notificaciones y administración).

Recursos

Alcance

Incluye pruebas de:

Registro, autenticación y gestión de usuarios según rol

Búsqueda y filtrado de barberías

Agendamiento y gestión de citas

Estados de citas

Pagos con retención de abonos

Simulación de cortes de cabello con IA

Sistema de puntos

Gestión de ganancias, inventario y personal

Promociones y publicidad

Notificaciones al usuario

Valoraciones y comentarios

Fuera del Alcance

Las pruebas de accesibilidad avanzadas y pruebas UX profundas.

Pruebas de Rendimiento

Los detalles sobre las pruebas de rendimiento se documentarán en un plan específico. Estas pruebas validarán que el sistema soporte múltiples usuarios concurrentes, especialmente durante procesos críticos como búsqueda de barberías, agendamiento y pagos.

Pruebas de Aceptación (UAT)

Las pruebas de aceptación serán realizadas con usuarios representativos del sistema:

Clientes

Barberos

Dueños de barbería

Administradores

El objetivo es validar que el sistema cumple con los requerimientos definidos y que la experiencia de uso es adecuada para cada rol.

Infraestructura

El entorno de pruebas se ejecutará en un ambiente similar al de producción, utilizando:

Servicios en la nube (Azure)

Base de datos de prueba

APIs externas en modo sandbox (Mercado pago, IA)

Esto permitirá simular condiciones reales de uso del sistema.

Suposiciones

El sistema contará con todos los módulos implementados según los requerimientos definidos. Los servicios externos (pagos, IA) estarán disponibles en entornos de prueba y los usuarios de prueba tendrán conocimientos básicos para interactuar con la plataforma.

Riesgos

Plan de Pruebas