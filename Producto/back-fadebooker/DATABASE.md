# 🗄️ Base de Datos - FadeBooker

## Conexión

```
Servidor: fadebooker-server.database.windows.net
BD: FadeBooker_DB
Usuario: adminuser
Motor: Azure SQL Server 2019+
Status: ✅ ACTIVA
```

## Tablas Principales

| Tabla | Registros | Propósito |
|-------|-----------|----------|
| **Usuario** | 6 | Base para authentication |
| **Cliente** | 2 | Clientes que reservan citas |
| **Barbero** | 2 | Barberos que atienden |
| **Tienda** | 2 | Ubicaciones de barberías |
| **Servicio** | 7 | Catálogo de servicios |
| **ServicioTienda** | N | Servicios por tienda (con precios) |
| **Cita** | 10 | Reservas de clientes |
| **Pago** | 9 | Registros de pagos |
| **Reseña** | 2 | Calificaciones de clientes |
| **AuditLog** | N | Registro de cambios |

## Relaciones Principales

```
Usuario
├─ Cliente (1:1 vía id_usuario_cliente)
├─ Barbero (1:1 vía id_usuario_barbero)
└─ Tienda (1:N vía id_usuario_admin)

Tienda
├─ Barbero (1:N)
├─ ServicioTienda (1:N)
└─ Cita (1:N)

Cita
├─ Cliente (N:1)
├─ Barbero (N:1)
├─ Servicio (N:1)
├─ Pago (1:1 vía id_cita)
└─ Reseña (1:1 vía id_cita_reseña)
```

## Índices Implementados

- `UX_Usuario_Email` - Email único por usuario
- `IX_Cita_IdCliente` - Búsqueda rápida de citas del cliente
- `IX_Cita_IdBarbero` - Búsqueda de disponibilidad
- `IX_Cita_Estado` - Filtro por estado (confirmada, completada, cancelada)
- `IX_Cita_FechaHora` - Ordenamiento y búsqueda de horarios
- +8 índices más para optimización

## Funciones Almacenadas

1. **usp_AgendarCita** - Create cita con validaciones
2. **usp_CancelarCita** - Delete con motivo
3. **usp_ReporteVentasTienda** - Analytics por tienda

## Vistas

1. **CitasProximas** - Citas sin completar, ordenadas por fecha
2. **CalificacionesBarbero** - Promedio de reseñas por barbero
3. **VentasPorTienda** - Monto total vendido por tienda

## Triggers

- Validate horarios de cita vs tienda
- Auto-calcula calificación promedio en barbero
- Audit log en cambios críticos
- Validate estado en tabla Cita

## Script de Inicialización

```bash
# Ejecutar en Azure SQL
Documentación/Documentos/FadeBooker_ScriptBD.sql
```

Esto crea todas las tablas, índices, funciones, triggers y vistas.

## Datos de Prueba

```bash
# Poblar BD con 51 registros demo
Documentación/Documentos/FadeBooker_DatosTest.sql
```

## Últimos Cambios

- ✅ Schema completamente normalizado (3NF)
- ✅ Triggers validando integridad
- ✅ Índices optimizando queries
- ✅ Test data poblado y verificado
- ✅ Audit trail implementado
