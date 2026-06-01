# plan de calidad-fadebooker

> **Fuente:** `Documentos/plan de calidad-fadebooker.docx`  
> **Tipo:** `.DOCX`  
> **Tamaño:** `74.3 KB`

---

PLAN DE CALIDAD

Proyecto:  FadeBooker - Sistema Inteligente de Gestión de Barberías

Asignatura:	Taller aplicado de programación - TPY1101
Grupo: 		5
Integrantes:	Mauricio Tapia
		Steve Lázaro

Fernanda González
		Nicolás Vallejos

1. Objetivo

El presente Plan de Calidad tiene como objetivo definir los criterios, estándares y actividades necesarias para asegurar que el sistema de gestión de barbería cumpla con los requisitos funcionales y no funcionales establecidos, garantizando su correcto funcionamiento, seguridad y satisfacción de los usuarios.

2. Alcance

Este plan aplica a todos los módulos del sistema, incluyendo:

Registro e inicio de sesión de usuarios

Búsqueda y filtrado de barberías

Agendamiento y gestión de citas

Sistema de pagos y abonos

Simulación de cortes de cabello

Sistema de puntos y valoraciones

Gestión de personal e ingresos

Publicación de proveedores

Gestión de promociones y publicidad

Administración general del sistema

3. Roles y Responsabilidades

En esta sección se definen los roles involucrados en el desarrollo y uso del sistema, junto con sus respectivas responsabilidades.

4. Estándares de Calidad

El sistema deberá cumplir con los siguientes estándares de calidad basados en los requerimientos definidos:

El sistema debe permitir el registro de usuarios según su rol.

El sistema debe permitir autenticación segura mediante inicio de sesión.

El sistema debe mostrar barberías cercanas según ubicación del cliente.

El sistema debe permitir filtrar barberías por distancia y disponibilidad.

El sistema debe mostrar únicamente horarios disponibles al agendar una cita.

El sistema debe gestionar correctamente los estados de una cita.

El sistema debe validar pagos antes de confirmar reservas.

El sistema debe permitir la acumulación de puntos por servicios.

El sistema debe permitir la gestión de ingresos por parte del barbero.

El sistema debe permitir la gestión de personal.

El sistema debe permitir la gestión de promociones y publicidad.

El sistema debe permitir la publicación de ventas de proveedores.

El sistema debe permitir la visualización de publicaciones de proveedores por barberos y dueños.

El sistema debe permitir calificar y comentar servicios.

5. Estrategia de Pruebas

Para asegurar la calidad del sistema, se aplicarán los siguientes tipos de pruebas:

Pruebas funcionales: Validan que cada funcionalidad cumpla con las historias de usuario definidas.

Pruebas de integración: Verifican la correcta interacción entre módulos (ej: pago + agendamiento).

Pruebas de usuario: Evaluación del sistema por parte de usuarios reales.

Pruebas de error: Validación de comportamiento ante datos incorrectos o fallos del sistema.

6. Criterios de Aceptación

Los siguientes criterios permiten determinar si el sistema cumple con los estándares de calidad definidos.

El sistema será considerado aceptable cuando:

Cumpla con todas las historias de usuario definidas.

No existan errores críticos en funcionalidades principales.

Los usuarios puedan completar procesos clave (registro, agendamiento, pago) sin fallos.

La información se registre y actualice correctamente en la base de datos.

7. Gestión de Incidentes

Esta sección describe el procedimiento a seguir en caso de detectar errores o fallos en el sistema.

Los incidentes serán registrados.

Se analizará su causa.

Se aplicarán correcciones antes de la entrega final.

Se validará nuevamente la funcionalidad afectada.

8. Herramientas Utilizadas

A continuación, se detallan las herramientas utilizadas para el desarrollo, modelado y validación del sistema.

React + Vite: Desarrollo del frontend web del sistema.

Node.js + Express: Desarrollo de la API y lógica de negocio.

Azure App Service: Hosting y despliegue cloud del sistema.

Draw.io: Diseño de diagramas UML y modelos de procesos.

Navegadores web: Ejecución de pruebas funcionales.

Herramientas de validación: Verificación del correcto funcionamiento del sistema.

Conclusión

El presente Plan de Calidad establece los lineamientos necesarios para asegurar el correcto desarrollo y funcionamiento del sistema FadeBooker. A través de la definición de estándares, estrategias de prueba y criterios de aceptación, se busca garantizar que la plataforma cumpla con los requerimientos establecidos y entregue una experiencia confiable a los usuarios.

La aplicación de este plan permitirá detectar y corregir errores de manera oportuna, asegurando la calidad del producto final antes de su implementación.