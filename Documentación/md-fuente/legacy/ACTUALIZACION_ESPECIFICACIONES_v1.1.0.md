# 📝 Actualización de Especificación Técnica (v1.1.0) - Abr-2026

**Nota Importante:** Este documento contiene las actualizaciones necesarias para los archivos `.xlsx` y `.docx` que no se pueden editar directamente. Los datos aquí descritos deben ser migrados a sus respectivos archivos originales.

---

## 1. Requerimientos (Actualización para Requerimientos.xlsx)

### Nuevos Requerimientos Funcionales (RF)
- **RF-SEC-01: Auditoría de Seguridad.** El sistema debe implementar logs de auditoría para todas las acciones sensibles (cambio de roles, eliminación de citas, transacciones fallidas) supervisados por el esquema de seguridad del Security Agent.
- **RF-FE-01: Integración React.** La interfaz debe permitir la carga dinámica de componentes React dentro del contenedor de Power Pages para las vistas de: Búsqueda de Barberos, Reserva de Cita y Perfil de Usuario.
- **RF-FE-02: Dashboard de Gestión.** Implementación de un dashboard interactivo para dueños de barberías con visualización de ingresos en tiempo real.

### Nuevos Requerimientos No Funcionales (RNF)
- **RNF-SEC-01: Encriptación de Datos Sensibles.** Todos los datos personales identificables (PII) deben ser encriptados en reposo en la base de datos SQL Server siguiendo el estándar AES-256.
- **RNF-FE-01: Performance de Componentes.** Los componentes React deben cargar en menos de 200ms una vez inicializado el runtime de la página.

---

## 2. Historias de Usuario (Actualización para Historias Usuario.xlsx)

### HU-010: Seguridad de Transacciones
**Como** Administrador del Sistema
**Quiero** que el Security Agent valide cada despliegue de código
**Para** asegurar que no existan vulnerabilidades de SQL Injection o XSS en los formularios de reserva.

### HU-011: Experiencia de Reserva Dinámica
**Como** Cliente
**Quiero** ver la disponibilidad de los barberos en un calendario interactivo React
**Para** agendar mi cita sin recargar la página y con confirmación instantánea.

---

## 3. Diccionario de Datos (Actualización para Diccionario de Datos.xlsx)

### Tabla: AuditoriaSeguridad (Nueva)
| Campo | Tipo | Nulidad | Descripción |
|-------|------|---------|-------------|
| id_log | INT (PK) | NOT NULL | Identificador único del evento de seguridad. |
| id_usuario | INT (FK) | NOT NULL | Usuario que realizó la acción. |
| accion | VARCHAR(100) | NOT NULL | Descripción de la acción (LOGIN, UPDATE_PROFILE, etc). |
| fecha_hora | DATETIME | NOT NULL | Timestamp del evento. |
| ip_origen | VARCHAR(45) | NOT NULL | Dirección IP del cliente. |

### Tabla: ComponenteFrontend (Nueva para Gestión)
| Campo | Tipo | Nulidad | Descripción |
|-------|------|---------|-------------|
| id_componente | INT (PK) | NOT NULL | ID del componente React. |
| nombre | VARCHAR(50) | NOT NULL | Nombre técnico del componente (ej: SearchBarber). |
| version | VARCHAR(10) | NOT NULL | Versión semántica del componente. |
| estado | VARCHAR(20) | NOT NULL | Estado (Desarrollo, Pruebas, Producción). |

---

## 4. Notas para el Equipo
- Los cambios en el esquema de BD (AuditoriaSeguridad) ya han sido notificados al **Database Agent**.
- El **Security Agent** debe validar la implementación de la encriptación AES-256 antes del siguiente deploy a `develop`.
- Documentación generada por **Documentation Agent** el 28 de abril de 2026.
