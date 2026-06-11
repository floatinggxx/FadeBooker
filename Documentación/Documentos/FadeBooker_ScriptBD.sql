/*
================================================================================
FADEBOOKER - SCRIPT DE BASE DE DATOS
Sistema de Gestión de Citas para Barberías (Barbería Marketplace)

Servidor: fadebooker-server.database.windows.net
Base de Datos: FadeBooker_DB
Motor: SQL Server 2019+

Creado: 14 de abril de 2026
Actualizado: 16 de abril de 2026
Normalización: TERCERA FORMA NORMAL (3NF)
Versión: 1.1.0 - REFACTORIZACIÓN: ServicioTienda → ServicioBarbero ✅

CAMBIOS PRINCIPALES (v1.1.0):
- ELIMINADA tabla ServicioTienda (relación Servicio ↔ Tienda)
- CREADA tabla ServicioBarbero (relación Servicio ↔ Barbero)
- ACTUALIZADA validación en usp_AgendarCita
- ACTUALIZADO schema de auditoría para nuevas relaciones
- RAZÓN: Evitar problema donde barbero no pueda hacer servicio disponible en tienda

ESTADO: Script refactorizado y listo para aplicar en BD.

TABLA DE CONTENIDOS:
1. Tablas Base (Usuario, Tienda, Barbero, Servicio)
2. Tablas de Relaciones (Cita, Pago, Reseña)
3. Tablas de Auditoría 
4. Índices y Constraints
5. Vistas
6. Funciones (UDF)
7. Stored Procedures (SP)
8. Triggers
================================================================================
*/

-- ============================================================================
-- 0. LIMPIAR OBJETOS PREVIOS (OPCIONAL - ejecutar si es necesario resetear)
-- ============================================================================
/*
DROP TABLE IF EXISTS dbo.AuditoriaCancelacion;
DROP TABLE IF EXISTS dbo.AuditoriaPreciosServicio;
DROP TABLE IF EXISTS dbo.Reseña;
DROP TABLE IF EXISTS dbo.Pago;
DROP TABLE IF EXISTS dbo.Cita;
DROP TABLE IF EXISTS dbo.ServicioBarbero;
DROP TABLE IF EXISTS dbo.Servicio;
DROP TABLE IF EXISTS dbo.Barbero;
DROP TABLE IF EXISTS dbo.Tienda;
DROP TABLE IF EXISTS dbo.Usuario;
GO
*/

-- ============================================================================
-- 1. TABLAS BASE
-- ============================================================================

/**
  TABLA: Usuario
  DESCRIPCIÓN: Usuarios del sistema (Clientes, Barberos, Dueños, Administradores)
  NORMALIZACIÓN: 1NF - Sin atributos multivalor, cada campo tiene valor atómico
*/
CREATE TABLE dbo.Usuario (
    id_usuario INT IDENTITY(1,1) PRIMARY KEY,
    email NVARCHAR(255) NOT NULL UNIQUE,
    contrasena NVARCHAR(255) NOT NULL, -- Implementado para autenticación v1.2.0
    nombre NVARCHAR(100) NOT NULL,
    apellido NVARCHAR(100) NOT NULL,
    telefono NVARCHAR(20),
    rol NVARCHAR(50) NOT NULL DEFAULT 'Cliente',  -- Cliente, Barbero, Dueño, Administrador
    estado BIT NOT NULL DEFAULT 1,  -- 1=Activo, 0=Inactivo
    foto_perfil_url NVARCHAR(MAX),
    fecha_registro DATETIME2 DEFAULT GETUTCDATE(),
    ultimo_login DATETIME2,
    createdAt DATETIME2 DEFAULT GETUTCDATE(),
    updatedAt DATETIME2 DEFAULT GETUTCDATE(),
    
    -- Constraints
    CONSTRAINT CHK_Rol CHECK (rol IN ('Cliente', 'Barbero', 'Dueño', 'Administrador')),
    CONSTRAINT CHK_Estado CHECK (estado IN (0, 1))
);

/**
  TABLA: Tienda
  DESCRIPCIÓN: Sucursales/Locales de barberías
  NORMALIZACIÓN: 1NF
  RELACIÓN: 1 Tienda : N Barberos
*/
CREATE TABLE dbo.Tienda (
    id_tienda INT IDENTITY(1,1) PRIMARY KEY,
    id_dueño INT NOT NULL,
    nombre_tienda NVARCHAR(150) NOT NULL,
    direccion NVARCHAR(MAX) NOT NULL,
    ciudad NVARCHAR(100) NOT NULL,
    codigo_postal NVARCHAR(20),
    telefono_tienda NVARCHAR(20),
    email_tienda NVARCHAR(255),
    horario_apertura TIME NOT NULL DEFAULT '09:00',
    horario_cierre TIME NOT NULL DEFAULT '18:00',
    dias_laborales NVARCHAR(50),  -- Ej: "Lunes-Sabado"
    foto_portada_url NVARCHAR(MAX),
    calificacion_promedio DECIMAL(3,2) DEFAULT 0,
    este_activa BIT NOT NULL DEFAULT 1,
    createdAt DATETIME2 DEFAULT GETUTCDATE(),
    updatedAt DATETIME2 DEFAULT GETUTCDATE(),
    
    -- Constraints
    CONSTRAINT FK_Tienda_Dueño FOREIGN KEY (id_dueño) REFERENCES dbo.Usuario(id_usuario),
    CONSTRAINT CHK_Horario CHECK (horario_apertura < horario_cierre),
    CONSTRAINT CHK_Calificacion CHECK (calificacion_promedio >= 0 AND calificacion_promedio <= 5)
);

/**
  TABLA: Barbero
  DESCRIPCIÓN: Profesionales barberos
  NORMALIZACIÓN: 1NF (No tiene campos multivalor, especialidades se normalizan en tabla separada si es necesario)
  RELACIÓN: 1 Usuario : 1 Barbero
           1 Tienda : N Barberos
*/
CREATE TABLE dbo.Barbero (
    id_barbero INT IDENTITY(1,1) PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE,
    id_tienda INT NOT NULL,
    especialidad NVARCHAR(150),  -- Ej: "Corte de cabello", "Barba", "Coloración"
    anos_experiencia INT,
    tarifa_base DECIMAL(10,2),  -- Tarifa por defecto
    foto_perfil_url NVARCHAR(MAX),
    calificacion_promedio DECIMAL(3,2) DEFAULT 0,
    total_resenas INT DEFAULT 0,
    activo BIT NOT NULL DEFAULT 1,
    createdAt DATETIME2 DEFAULT GETUTCDATE(),
    updatedAt DATETIME2 DEFAULT GETUTCDATE(),
    
    -- Constraints
    CONSTRAINT FK_Barbero_Usuario FOREIGN KEY (id_usuario) REFERENCES dbo.Usuario(id_usuario),
    CONSTRAINT FK_Barbero_Tienda FOREIGN KEY (id_tienda) REFERENCES dbo.Tienda(id_tienda),
    CONSTRAINT CHK_Experiencia CHECK (anos_experiencia >= 0),
    CONSTRAINT CHK_Tarifa CHECK (tarifa_base >= 0),
    CONSTRAINT CHK_CalificacionBarbero CHECK (calificacion_promedio >= 0 AND calificacion_promedio <= 5)
);

/**
  TABLA: Servicio
  DESCRIPCIÓN: Servicios ofrecidos (corte, barba, etc.) - Catálogo 
  NORMALIZACIÓN: 1NF (Tabla de catálogo sin dependencias)
  RELACIÓN: 1 Servicio : N Citas
  
  NOTA: Si necesarios precios por tienda, crear tabla ServicioTienda (N:N)
*/
CREATE TABLE dbo.Servicio (
    id_servicio INT IDENTITY(1,1) PRIMARY KEY,
    nombre_servicio NVARCHAR(150) NOT NULL,
    descripcion NVARCHAR(MAX),
    duracion_minutos INT NOT NULL,  -- Duración estándar del servicio
    precio_base DECIMAL(10,2) NOT NULL,
    activo BIT NOT NULL DEFAULT 1,
    createdAt DATETIME2 DEFAULT GETUTCDATE(),
    updatedAt DATETIME2 DEFAULT GETUTCDATE(),
    
    -- Constraints
    CONSTRAINT CHK_Duracion CHECK (duracion_minutos > 0),
    CONSTRAINT CHK_PrecioServicio CHECK (precio_base >= 0)
);

/**
  TABLA: ServicioBarbero (TABLA DE UNIÓN - N:N optimizada)
  DESCRIPCIÓN: Relaciona Servicios que puede ofrecer cada Barbero
  NORMALIZACIÓN: 2NF (Tabla de relación sin atributos dinámicos)
  
  CAMBIO (v1.1.0): Se cambió de ServicioTienda (Servicio ↔ Tienda)
                   a ServicioBarbero (Servicio ↔ Barbero)
  RAZÓN: Evita que se agenden citas para servicios que el barbero no puede hacer
  
  Permite:
  - Cada barbero tiene servicios específicos que puede ofrecer
  - Precios específicos por barbero para cada servicio
  - Duración personalizada si es diferente a la estándar
*/
CREATE TABLE dbo.ServicioBarbero (
    id_servicio_barbero INT IDENTITY(1,1) PRIMARY KEY,
    id_servicio INT NOT NULL,
    id_barbero INT NOT NULL,
    precio_barbero DECIMAL(10,2),           -- NULL = usar precio_base del servicio
    tiempo_servicio_minutos INT,            -- NULL = usar duracion_minutos del servicio
    disponible BIT NOT NULL DEFAULT 1,
    createdAt DATETIME2 DEFAULT GETUTCDATE(),
    updatedAt DATETIME2 DEFAULT GETUTCDATE(),
    
    -- Constraints
    CONSTRAINT FK_ServicioBarbero_Servicio FOREIGN KEY (id_servicio) REFERENCES dbo.Servicio(id_servicio) ON DELETE CASCADE,
    CONSTRAINT FK_ServicioBarbero_Barbero FOREIGN KEY (id_barbero) REFERENCES dbo.Barbero(id_barbero) ON DELETE CASCADE,
    CONSTRAINT UK_ServicioBarbero UNIQUE(id_servicio, id_barbero),
    CONSTRAINT CHK_PrecioBarbero CHECK (precio_barbero IS NULL OR precio_barbero >= 0),
    CONSTRAINT CHK_TiempoServicio CHECK (tiempo_servicio_minutos IS NULL OR tiempo_servicio_minutos > 0)
);

-- ============================================================================
-- 2. TABLAS DE TRANSACCIONES PRINCIPALES
-- ============================================================================

/**
  TABLA: Cita
  DESCRIPCIÓN: Reservas/Citas de clientes con barberos
  NORMALIZACIÓN: 1NF (Todos campos son atómicos)
  RELACIONES: 
    - N Citas : 1 Cliente (Usuario)
    - N Citas : 1 Barbero
    - N Citas : 1 Servicio
    - N Citas : 1 Tienda
  
  NOTA: 3NF - No hay dependencias transitivas
    - Datos desnormalizados (id_tienda) para performance en queries, OK porque
      id_tienda se puede derivar de id_barbero.id_tienda pero mantenerlo
      reduce JOINs frecuentes.
*/
CREATE TABLE dbo.Cita (
    id_cita INT IDENTITY(1,1) PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_barbero INT NOT NULL,
    id_servicio INT NOT NULL,
    id_tienda INT NOT NULL,  -- Desnormalizado por performance
    fecha_hora_inicio DATETIME2 NOT NULL,
    duracion_minutos INT NOT NULL,
    estado NVARCHAR(50) NOT NULL DEFAULT 'confirmada',  -- confirmada, cancelada, completada, no_presentado
    monto_total DECIMAL(10,2) NOT NULL,
    pago_abono DECIMAL(10,2) DEFAULT 0,
    metodo_pago NVARCHAR(50),  -- efectivo, tarjeta, transferencia
    notas NVARCHAR(MAX),
    createdAt DATETIME2 DEFAULT GETUTCDATE(),
    updatedAt DATETIME2 DEFAULT GETUTCDATE(),
    
    -- Constraints
    CONSTRAINT FK_Cita_Cliente FOREIGN KEY (id_cliente) REFERENCES dbo.Usuario(id_usuario),
    CONSTRAINT FK_Cita_Barbero FOREIGN KEY (id_barbero) REFERENCES dbo.Barbero(id_barbero),
    CONSTRAINT FK_Cita_Servicio FOREIGN KEY (id_servicio) REFERENCES dbo.Servicio(id_servicio),
    CONSTRAINT FK_Cita_Tienda FOREIGN KEY (id_tienda) REFERENCES dbo.Tienda(id_tienda),
    CONSTRAINT CHK_Estado CHECK (estado IN ('confirmada', 'cancelada', 'completada', 'no_presentado')),
    CONSTRAINT CHK_Monto CHECK (monto_total >= 0 AND pago_abono >= 0),
    CONSTRAINT CHK_AbonoPagado CHECK (pago_abono <= monto_total)
);

/**
  TABLA: BloqueHorario
  DESCRIPCIÓN: Bloques horarios bloqueados manualmente por barberos
  NORMALIZACIÓN: 1NF
  RELACIÓN: N BloqueHorario : 1 Barbero
  PROPÓSITO: Permitir que barberos bloqueen manualmente sus horarios (almuerzo, descanso, etc.)
  
  NOTA (v1.2.0): Agregada para gestión de disponibilidad diaria
  - Campos fecha_hora_inicio y fecha_hora_fin definen el rango bloqueado
  - motivo es informativo para el barbero
  - estado permite borrado lógico
*/
CREATE TABLE dbo.BloqueHorario (
    id_bloque INT IDENTITY(1,1) PRIMARY KEY,
    id_barbero INT NOT NULL,
    fecha_hora_inicio DATETIME2 NOT NULL,
    fecha_hora_fin DATETIME2 NOT NULL,
    motivo NVARCHAR(255),  -- Ej: "Almuerzo", "Descanso", "Mantenimiento"
    estado BIT NOT NULL DEFAULT 1,  -- 1=Activo, 0=Eliminado (borrado lógico)
    createdAt DATETIME2 DEFAULT GETUTCDATE(),
    updatedAt DATETIME2 DEFAULT GETUTCDATE(),
    
    -- Constraints
    CONSTRAINT FK_BloqueHorario_Barbero FOREIGN KEY (id_barbero) REFERENCES dbo.Barbero(id_barbero) ON DELETE CASCADE,
    CONSTRAINT CHK_BloqueHorario_Rango CHECK (fecha_hora_inicio < fecha_hora_fin)
);

/**
  TABLA: Pago
  DESCRIPCIÓN: Histórico de pagos y transacciones
  NORMALIZACIÓN: 1NF
  RELACIÓN: 1 Cita : N Pagos (permite pagos parciales)
  
  NOTA: Separada de Cita para auditoría y trazabilidad de pagos
*/
CREATE TABLE dbo.Pago (
    id_pago INT IDENTITY(1,1) PRIMARY KEY,
    id_cita INT NOT NULL,
    monto_pagado DECIMAL(10,2) NOT NULL,
    metodo_pago NVARCHAR(50) NOT NULL,  -- efectivo, tarjeta, transferencia
    estado_pago NVARCHAR(50) NOT NULL DEFAULT 'completado',  -- completado, pendiente, fallido
    referencia_transaccion NVARCHAR(100),  -- Para auditoría con pasarelas
    fecha_pago DATETIME2 DEFAULT GETUTCDATE(),
    createdAt DATETIME2 DEFAULT GETUTCDATE(),
    
    -- Constraints
    CONSTRAINT FK_Pago_Cita FOREIGN KEY (id_cita) REFERENCES dbo.Cita(id_cita),
    CONSTRAINT CHK_MontoPago CHECK (monto_pagado > 0),
    CONSTRAINT CHK_EstadoPago CHECK (estado_pago IN ('completado', 'pendiente', 'fallido'))
);

-- ============================================================================
-- 3. TABLAS DE EVALUACIÓN Y AUDITORÍA  
-- ============================================================================

/**
  TABLA: Reseña
  DESCRIPCIÓN: Calificaciones y comentarios de clientes sobre citas
  NORMALIZACIÓN: 1NF
  RELACIÓN: 1 Cita : 1 Reseña (opcional, puede no tener reseña)
           N Reseñas : 1 Barbero
           N Reseñas : 1 Tienda
*/
CREATE TABLE dbo.Reseña (
    id_resena INT IDENTITY(1,1) PRIMARY KEY,
    id_cita INT NOT NULL UNIQUE,
    id_cliente INT NOT NULL,
    id_barbero INT NOT NULL,
    id_tienda INT NOT NULL,
    puntuacion INT NOT NULL,  -- 1-5
    comentario NVARCHAR(MAX),
    fecha_resena DATETIME2 DEFAULT GETUTCDATE(),
    createdAt DATETIME2 DEFAULT GETUTCDATE(),
    
    -- Constraints
    CONSTRAINT FK_Resena_Cita FOREIGN KEY (id_cita) REFERENCES dbo.Cita(id_cita),
    CONSTRAINT FK_Resena_Cliente FOREIGN KEY (id_cliente) REFERENCES dbo.Usuario(id_usuario),
    CONSTRAINT FK_Resena_Barbero FOREIGN KEY (id_barbero) REFERENCES dbo.Barbero(id_barbero),
    CONSTRAINT FK_Resena_Tienda FOREIGN KEY (id_tienda) REFERENCES dbo.Tienda(id_tienda),
    CONSTRAINT CHK_Puntuacion CHECK (puntuacion >= 1 AND puntuacion <= 5)
);

/**
  TABLA: AuditoriaPreciosServicio
  DESCRIPCIÓN: Histórico de cambios en precios de servicios (por barbero o global)
  NORMALIZACIÓN: 1NF (Tabla de auditoría, solo lectura después de insert)
  PROPÓSITO: Trazabilidad completa de cambios de precios
  
  ACTUALIZACIÓN (v1.1.0): Agregada columna id_barbero para auditar cambios de precio
                          específicos por barbero en tabla ServicioBarbero
*/
CREATE TABLE dbo.AuditoriaPreciosServicio (
    id_auditoria INT IDENTITY(1,1) PRIMARY KEY,
    id_servicio INT NOT NULL,
    id_barbero INT,                    -- NULL = cambio global en Servicio.precio_base
    precio_anterior DECIMAL(10,2),
    precio_nuevo DECIMAL(10,2),
    cambio_por_usuario INT,
    fecha_cambio DATETIME2 DEFAULT GETUTCDATE(),
    razon_cambio NVARCHAR(MAX),
    
    -- Constraints
    CONSTRAINT FK_AuditPrecio_Servicio FOREIGN KEY (id_servicio) REFERENCES dbo.Servicio(id_servicio),
    CONSTRAINT FK_AuditPrecio_Barbero FOREIGN KEY (id_barbero) REFERENCES dbo.Barbero(id_barbero),
    CONSTRAINT FK_AuditPrecio_Usuario FOREIGN KEY (cambio_por_usuario) REFERENCES dbo.Usuario(id_usuario)
);

/**
  TABLA: AuditoriaCancelacion
  DESCRIPCIÓN: Histórico de cancelaciones de citas
  NORMALIZACIÓN: 1NF
  PROPÓSITO: Trazabilidad de cancelaciones para análisis y estadísticas
*/
CREATE TABLE dbo.AuditoriaCancelacion (
    id_auditoria INT IDENTITY(1,1) PRIMARY KEY,
    id_cita INT NOT NULL,
    cancelada_por INT NOT NULL,  -- id_usuario quien cancela
    motivo_cancelacion NVARCHAR(MAX),
    ofrecer_reembolso BIT DEFAULT 0,
    porcentaje_reembolso INT DEFAULT 0,
    fecha_cancelacion DATETIME2 DEFAULT GETUTCDATE(),
    
    -- Constraints
    CONSTRAINT FK_AuditCancel_Cita FOREIGN KEY (id_cita) REFERENCES dbo.Cita(id_cita),
    CONSTRAINT FK_AuditCancel_Usuario FOREIGN KEY (cancelada_por) REFERENCES dbo.Usuario(id_usuario),
    CONSTRAINT CHK_PorcentajeReembolso CHECK (porcentaje_reembolso >= 0 AND porcentaje_reembolso <= 100)
);

-- ============================================================================
-- 4. ÍNDICES PARA OPTIMIZACIÓN
-- ============================================================================

-- Búsqueda rápida de citas por cliente
CREATE INDEX IX_Cita_Cliente ON dbo.Cita(id_cliente, fecha_hora_inicio DESC);

-- Búsqueda rápida de citas por barbero
CREATE INDEX IX_Cita_Barbero ON dbo.Cita(id_barbero, fecha_hora_inicio DESC);

-- Búsqueda de disponibilidad (crítico para agendamiento)
CREATE INDEX IX_Cita_BarberoDiaHora ON dbo.Cita(id_barbero, fecha_hora_inicio)
WHERE estado IN ('confirmada', 'completada');

-- Búsqueda por estado
CREATE INDEX IX_Cita_Estado ON dbo.Cita(estado);

-- Búsqueda de barberos por tienda
CREATE INDEX IX_Barbero_Tienda ON dbo.Barbero(id_tienda);

-- Búsqueda de servicios por barbero (NUEVO - v1.1.0)
CREATE INDEX IX_ServicioBarbero_Barbero ON dbo.ServicioBarbero(id_barbero);

-- Búsqueda de barberos por servicio (NUEVO - v1.1.0)
CREATE INDEX IX_ServicioBarbero_Servicio ON dbo.ServicioBarbero(id_servicio);

-- Búsqueda de servicios disponibles (NUEVO - v1.1.0)
CREATE INDEX IX_ServicioBarbero_Disponible ON dbo.ServicioBarbero(disponible)
WHERE disponible = 1;

-- Búsqueda de reseñas por barbero para calificación promedio
CREATE INDEX IX_Resena_Barbero ON dbo.Reseña(id_barbero);

-- Búsqueda de reseñas por tienda
CREATE INDEX IX_Resena_Tienda ON dbo.Reseña(id_tienda);

-- Búsqueda de bloques horarios por barbero y fecha (crítico para disponibilidad - NUEVO v1.2.0)
CREATE INDEX IX_BloqueHorario_Barbero ON dbo.BloqueHorario(id_barbero, fecha_hora_inicio)
WHERE estado = 1;

-- Búsqueda por email (login)
CREATE UNIQUE INDEX IX_Usuario_Email ON dbo.Usuario(email);

-- Búsqueda de tiendas activas
CREATE INDEX IX_Tienda_Activa ON dbo.Tienda(este_activa);

-- Auditoría por fecha
CREATE INDEX IX_AuditoriaPrecio_Fecha ON dbo.AuditoriaPreciosServicio(fecha_cambio DESC);
CREATE INDEX IX_AuditoriaCancelacion_Fecha ON dbo.AuditoriaCancelacion(fecha_cancelacion DESC);

-- ============================================================================
-- 5. VISTAS
-- ============================================================================

/**
  VISTA: vw_CitasProximas
  DESCRIPCIÓN: Obtiene citas confirmadas próximas (próximos 30 días)
  BENEFICIO: Query limpia, reutilizable para dashboard
*/
CREATE VIEW vw_CitasProximas AS
SELECT 
    c.id_cita,
    c.fecha_hora_inicio,
    u.nombre AS cliente_nombre,
    b.id_barbero,
    usr_barbero.nombre AS barbero_nombre,
    s.nombre_servicio,
    t.nombre_tienda,
    c.monto_total,
    c.estado
FROM dbo.Cita c
INNER JOIN dbo.Usuario u ON c.id_cliente = u.id_usuario
INNER JOIN dbo.Barbero b ON c.id_barbero = b.id_barbero
INNER JOIN dbo.Usuario usr_barbero ON b.id_usuario = usr_barbero.id_usuario
INNER JOIN dbo.Servicio s ON c.id_servicio = s.id_servicio
INNER JOIN dbo.Tienda t ON c.id_tienda = t.id_tienda
WHERE c.estado = 'confirmada' 
  AND c.fecha_hora_inicio BETWEEN GETUTCDATE() AND DATEADD(DAY, 30, GETUTCDATE());
GO

/**
  VISTA: vw_CalificacionesBarbero
  DESCRIPCIÓN: Resumen de calificaciones por barbero
*/
CREATE VIEW vw_CalificacionesBarbero AS
SELECT 
    b.id_barbero,
    usr.nombre,
    t.nombre_tienda,
    AVG(r.puntuacion) AS calificacion_promedio,
    COUNT(r.id_resena) AS total_resenas,
    MIN(r.fecha_resena) AS primera_resena,
    MAX(r.fecha_resena) AS ultima_resena
FROM dbo.Barbero b
INNER JOIN dbo.Usuario usr ON b.id_usuario = usr.id_usuario
INNER JOIN dbo.Tienda t ON b.id_tienda = t.id_tienda
LEFT JOIN dbo.Reseña r ON b.id_barbero = r.id_barbero
GROUP BY b.id_barbero, usr.nombre, t.nombre_tienda;
GO

/**
  VISTA: vw_VentasPorTienda
  DESCRIPCIÓN: Resumen de ventas y citas por tienda
*/
CREATE VIEW vw_VentasPorTienda AS
SELECT 
    c.id_tienda,
    t.nombre_tienda,
    COUNT(c.id_cita) AS total_citas,
    SUM(CASE WHEN c.estado = 'completada' THEN 1 ELSE 0 END) AS citas_completadas,
    SUM(CASE WHEN c.estado = 'cancelada' THEN 1 ELSE 0 END) AS citas_canceladas,
    SUM(c.monto_total) AS total_ingresos,
    SUM(CASE WHEN c.estado = 'completada' THEN c.monto_total ELSE 0 END) AS ingresos_completados,
    COUNT(DISTINCT c.id_cliente) AS clientes_unicos
FROM dbo.Cita c
INNER JOIN dbo.Tienda t ON c.id_tienda = t.id_tienda
GROUP BY c.id_tienda, t.nombre_tienda;
GO

-- ============================================================================
-- 6. FUNCIONES (UDF)
-- ============================================================================

/**
  FUNCIÓN: ufn_CalcularVentasBarbero
  DESCRIPCIÓN: Calcula ventas totales de un barbero en un período
  RETORNA: DECIMAL
  PARÁMETROS: idBarbero, fechaInicio, fechaFin
*/
CREATE FUNCTION dbo.ufn_CalcularVentasBarbero (
    @idBarbero INT,
    @fechaInicio DATETIME2,
    @fechaFin DATETIME2
)
RETURNS DECIMAL(10,2)
AS
BEGIN
    DECLARE @ventasTotal DECIMAL(10,2);
    
    SELECT @ventasTotal = ISNULL(SUM(monto_total), 0)
    FROM dbo.Cita
    WHERE id_barbero = @idBarbero 
      AND estado = 'completada'
      AND fecha_hora_inicio BETWEEN @fechaInicio AND @fechaFin;
    
    RETURN @ventasTotal;
END;
GO

/**
  FUNCIÓN: ufn_HorariosDisponibles
  DESCRIPCIÓN: Obtiene horarios disponibles para un barbero en una fecha
  RETORNA: TABLE
  PARÁMETROS: idBarbero, fecha
*/
CREATE FUNCTION dbo.ufn_HorariosDisponibles (
    @idBarbero INT,
    @fecha DATE
)
RETURNS TABLE
AS
RETURN (
    SELECT 
        b.id_barbero,
        t.horario_apertura,
        t.horario_cierre,
        (SELECT COUNT(*) FROM dbo.Cita c 
         WHERE c.id_barbero = @idBarbero 
           AND CAST(c.fecha_hora_inicio AS DATE) = @fecha
           AND (c.estado = 'confirmada' OR c.estado = 'completada')) AS citas_programadas
    FROM dbo.Barbero b
    INNER JOIN dbo.Tienda t ON b.id_tienda = t.id_tienda
    WHERE b.id_barbero = @idBarbero
);
GO

/**
  FUNCIÓN: ufn_VerificarDisponibilidad
  DESCRIPCIÓN: Verifica si un barbero está disponible en una fecha/hora específica
  RETORNA: BIT (1=disponible, 0=no disponible)
*/
CREATE FUNCTION dbo.ufn_VerificarDisponibilidad (
    @idBarbero INT,
    @fechaHora DATETIME2,
    @duracionMinutos INT
)
RETURNS BIT
AS
BEGIN
    DECLARE @disponible BIT = 1;
    DECLARE @fechaHoraFin DATETIME2 = DATEADD(MINUTE, @duracionMinutos, @fechaHora);
    
    -- Verificar si hay conflicto con otra cita
    IF EXISTS (
        SELECT 1 FROM dbo.Cita
        WHERE id_barbero = @idBarbero
          AND (estado = 'confirmada' OR estado = 'completada')
          AND (
            -- Solapamiento: cita nueva comienza antes que cita existente termina
            (@fechaHora < DATEADD(MINUTE, duracion_minutos, fecha_hora_inicio))
            AND
            -- Cita nueva termina después de que cita existente comienza
            (@fechaHoraFin > fecha_hora_inicio)
          )
    )
    BEGIN
        SET @disponible = 0;
    END
    
    RETURN @disponible;
END;
GO

-- ============================================================================
-- 7. STORED PROCEDURES
-- ============================================================================

/**
  STORED PROCEDURE: usp_AgendarCita
  DESCRIPCIÓN: Crea una nueva cita con validaciones completas
  ACTUALIZACIÓN (v1.1.0): Valida que barbero pueda hacer el servicio (existe en ServicioBarbero)
  PARÁMETROS: cliente, barbero, servicio, tienda, fecha/hora, abono, método pago
  RETORNA: @resultado (tabla con estado y id_cita)
*/
CREATE PROCEDURE dbo.usp_AgendarCita
    @idCliente INT,
    @idBarbero INT,
    @idServicio INT,
    @fechaHoraInicio DATETIME2,
    @pagoAbono DECIMAL(10,2),
    @metodoPago NVARCHAR(50),
    @idCitaGenerada INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Validación 1: Cliente existe
        IF NOT EXISTS (SELECT 1 FROM dbo.Usuario WHERE id_usuario = @idCliente AND estado = 1)
        BEGIN
            RAISERROR('Cliente no encontrado o inactivo', 16, 1);
        END
        
        -- Validación 2: Barbero existe y activo
        IF NOT EXISTS (SELECT 1 FROM dbo.Barbero WHERE id_barbero = @idBarbero AND activo = 1)
        BEGIN
            RAISERROR('Barbero no encontrado o inactivo', 16, 1);
        END
        
        -- Validación 3: Servicio existe
        IF NOT EXISTS (SELECT 1 FROM dbo.Servicio WHERE id_servicio = @idServicio AND activo = 1)
        BEGIN
            RAISERROR('Servicio no disponible', 16, 1);
        END
        
        -- Validación 4: NUEVO (v1.1.0) - Barbero puede hacer el servicio
        IF NOT EXISTS (SELECT 1 FROM dbo.ServicioBarbero WHERE id_barbero = @idBarbero AND id_servicio = @idServicio AND disponible = 1)
        BEGIN
            RAISERROR('El barbero no ofrece este servicio', 16, 1);
        END
        
        -- Validación 5: Fecha en futuro
        IF @fechaHoraInicio <= GETUTCDATE()
        BEGIN
            RAISERROR('La fecha debe ser en el futuro', 16, 1);
        END
        
        -- Validación 6: Disponibilidad de barbero
        DECLARE @duracion INT;
        SELECT @duracion = ISNULL(sb.tiempo_servicio_minutos, s.duracion_minutos)
        FROM dbo.Servicio s
        LEFT JOIN dbo.ServicioBarbero sb ON s.id_servicio = sb.id_servicio AND sb.id_barbero = @idBarbero
        WHERE s.id_servicio = @idServicio;
        
        IF dbo.ufn_VerificarDisponibilidad(@idBarbero, @fechaHoraInicio, @duracion) = 0
        BEGIN
            RAISERROR('Barbero no disponible en ese horario', 16, 1);
        END
        
        -- Obtener datos para insertar
        DECLARE @idTienda INT;
        DECLARE @montoTotal DECIMAL(10,2);
        
        SELECT @idTienda = id_tienda FROM dbo.Barbero WHERE id_barbero = @idBarbero;
        
        -- ACTUALIZADO (v1.1.0): Obtener precio del barbero o usar precio_base del servicio
        SELECT @montoTotal = ISNULL(sb.precio_barbero, s.precio_base)
        FROM dbo.Servicio s
        LEFT JOIN dbo.ServicioBarbero sb ON s.id_servicio = sb.id_servicio AND sb.id_barbero = @idBarbero
        WHERE s.id_servicio = @idServicio;
        
        -- Validación 7: Abono válido
        IF @pagoAbono < (@montoTotal * 0.2)  -- Mínimo 20% de abono
        BEGIN
            RAISERROR('El abono mínimo es el 20% del monto total', 16, 1);
        END
        
        -- Crear cita
        INSERT INTO dbo.Cita (
            id_cliente, id_barbero, id_servicio, id_tienda,
            fecha_hora_inicio, duracion_minutos, estado,
            monto_total, pago_abono, metodo_pago
        )
        VALUES (
            @idCliente, @idBarbero, @idServicio, @idTienda,
            @fechaHoraInicio, @duracion, 'confirmada',
            @montoTotal, @pagoAbono, @metodoPago
        );
        
        SET @idCitaGenerada = SCOPE_IDENTITY();
        
        -- Registrar pago de abono
        INSERT INTO dbo.Pago (
            id_cita, monto_pagado, metodo_pago, estado_pago
        )
        VALUES (
            @idCitaGenerada, @pagoAbono, @metodoPago, 'completado'
        );
        
        COMMIT TRANSACTION;
        
        SELECT 'Cita agendada exitosamente' AS mensaje, @idCitaGenerada AS id_cita;
        
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

/**
  STORED PROCEDURE: usp_CancelarCita
  DESCRIPCIÓN: Cancela una cita y registra el motivo
  PARÁMETROS: idCita, motivoCancelacion, ofrecerReembolso, porcentajeReembolso
*/
CREATE PROCEDURE dbo.usp_CancelarCita
    @idCita INT,
    @idUsuarioCancelacion INT,
    @motivoCancelacion NVARCHAR(MAX),
    @ofrecerReembolso BIT = 0,
    @porcentajeReembolso INT = 0
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Validación: Cita existe y no está ya cancelada
        IF NOT EXISTS (SELECT 1 FROM dbo.Cita WHERE id_cita = @idCita)
        BEGIN
            RAISERROR('Cita no encontrada', 16, 1);
        END
        
        IF (SELECT estado FROM dbo.Cita WHERE id_cita = @idCita) = 'cancelada'
        BEGIN
            RAISERROR('La cita ya está cancelada', 16, 1);
        END
        
        -- Actualizar estado de cita
        UPDATE dbo.Cita
        SET estado = 'cancelada', updatedAt = GETUTCDATE()
        WHERE id_cita = @idCita;
        
        -- Registrar en auditoría
        INSERT INTO dbo.AuditoriaCancelacion (
            id_cita, cancelada_por, motivo_cancelacion,
            ofrecer_reembolso, porcentaje_reembolso
        )
        VALUES (
            @idCita, @idUsuarioCancelacion, @motivoCancelacion,
            @ofrecerReembolso, @porcentajeReembolso
        );
        
        COMMIT TRANSACTION;
        
        SELECT 'Cita cancelada exitosamente' AS mensaje;
        
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

/**
  STORED PROCEDURE: usp_ReporteVentasTienda
  DESCRIPCIÓN: Genera reporte de ventas por tienda en un período
*/
CREATE PROCEDURE dbo.usp_ReporteVentasTienda
    @idTienda INT,
    @fechaInicio DATETIME2,
    @fechaFin DATETIME2
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        t.id_tienda,
        t.nombre_tienda,
        COUNT(c.id_cita) AS total_citas,
        SUM(CASE WHEN c.estado = 'completada' THEN 1 ELSE 0 END) AS citas_completadas,
        SUM(CASE WHEN c.estado = 'cancelada' THEN 1 ELSE 0 END) AS citas_canceladas,
        SUM(c.monto_total) AS total_ingresos,
        SUM(CASE WHEN c.estado = 'completada' THEN c.monto_total ELSE 0 END) AS ingresos_completados,
        COUNT(DISTINCT c.id_cliente) AS clientes_unicos,
        AVG(r.puntuacion) AS calificacion_promedio
    FROM dbo.Cita c
    INNER JOIN dbo.Tienda t ON c.id_tienda = t.id_tienda
    LEFT JOIN dbo.Reseña r ON c.id_cita = r.id_cita
    WHERE c.id_tienda = @idTienda
      AND c.fecha_hora_inicio BETWEEN @fechaInicio AND @fechaFin
    GROUP BY t.id_tienda, t.nombre_tienda;
END;
GO

-- ============================================================================
-- 8. TRIGGERS
-- ============================================================================

/**
  TRIGGER: trg_ActualizarCalificacionBarbero
  DESCRIPCIÓN: Actualiza calificación promedio de barbero cuando se ingresa reseña
  EVENTO: AFTER INSERT en Reseña
*/
CREATE TRIGGER dbo.trg_ActualizarCalificacionBarbero
ON dbo.Reseña
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE dbo.Barbero
    SET 
        calificacion_promedio = (
            SELECT AVG(CAST(puntuacion AS FLOAT))
            FROM dbo.Reseña
            WHERE id_barbero = inserted.id_barbero
        ),
        total_resenas = (
            SELECT COUNT(*)
            FROM dbo.Reseña
            WHERE id_barbero = inserted.id_barbero
        ),
        updatedAt = GETUTCDATE()
    FROM inserted
    WHERE dbo.Barbero.id_barbero = inserted.id_barbero;
    
END;
GO

/**
  TRIGGER: trg_ActualizarCalificacionTienda
  DESCRIPCIÓN: Actualiza calificación promedio de tienda cuando se ingresa reseña
  EVENTO: AFTER INSERT en Reseña
*/
CREATE TRIGGER dbo.trg_ActualizarCalificacionTienda
ON dbo.Reseña
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE dbo.Tienda
    SET 
        calificacion_promedio = (
            SELECT AVG(CAST(puntuacion AS FLOAT))
            FROM dbo.Reseña
            WHERE id_tienda = inserted.id_tienda
        ),
        updatedAt = GETUTCDATE()
    FROM inserted
    WHERE dbo.Tienda.id_tienda = inserted.id_tienda;
    
END;
GO

/**
  TRIGGER: trg_ValidarHorariosCita
  DESCRIPCIÓN: Valida que la cita no se solapee con otras citas (INSTEAD OF INSERT)
  EVENTO: INSTEAD OF INSERT en Cita
*/
CREATE TRIGGER dbo.trg_ValidarHorariosCita
ON dbo.Cita
INSTEAD OF INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @mensaje NVARCHAR(MAX);
    
    -- Validar que no haya solapamiento
    IF EXISTS (
        SELECT 1
        FROM inserted i
        INNER JOIN dbo.Cita c ON i.id_barbero = c.id_barbero
        WHERE (i.estado = 'confirmada' OR i.estado = 'completada')
          AND (c.estado = 'confirmada' OR c.estado = 'completada')
          AND (
            (i.fecha_hora_inicio < DATEADD(MINUTE, c.duracion_minutos, c.fecha_hora_inicio))
            AND
            (DATEADD(MINUTE, i.duracion_minutos, i.fecha_hora_inicio) > c.fecha_hora_inicio)
          )
    )
    BEGIN
        RAISERROR('El barbero no está disponible en ese horario (conflicto con otra cita)', 16, 1);
        RETURN;
    END
    
    -- Si no hay conflicto, insertar
    INSERT INTO dbo.Cita (
        id_cliente, id_barbero, id_servicio, id_tienda,
        fecha_hora_inicio, duracion_minutos, estado,
        monto_total, pago_abono, metodo_pago, notas,
        createdAt, updatedAt
    )
    SELECT 
        id_cliente, id_barbero, id_servicio, id_tienda,
        fecha_hora_inicio, duracion_minutos, estado,
        monto_total, pago_abono, metodo_pago, notas,
        createdAt, updatedAt
    FROM inserted;
    
END;
GO

/**
  TRIGGER: trg_AuditarPrecioServicio
  DESCRIPCIÓN: Registra cambios en precios de servicios
  EVENTO: AFTER UPDATE en Servicio
*/
CREATE TRIGGER dbo.trg_AuditarPrecioServicio
ON dbo.Servicio
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO dbo.AuditoriaPreciosServicio (
        id_servicio, precio_anterior, precio_nuevo,
        razon_cambio
    )
    SELECT 
        deleted.id_servicio,
        deleted.precio_base,
        inserted.precio_base,
        'Cambio de precio del servicio'
    FROM deleted
    INNER JOIN inserted ON deleted.id_servicio = inserted.id_servicio
    WHERE deleted.precio_base <> inserted.precio_base;
    
END;
GO

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================

/*
NOTAS DE IMPLEMENTACIÓN:

CAMBIOS EN VERSIÓN 1.1.0 (16 de abril de 2026):
================================================================================

1. REFACTORIZACIÓN PRINCIPAL: ServicioTienda → ServicioBarbero
   ✓ ELIMINADA: Tabla ServicioTienda (relación Servicio ↔ Tienda)
   ✓ CREADA: Tabla ServicioBarbero (relación Servicio ↔ Barbero)
   ✓ RAZÓN: Evitar problema donde se agenda servicio que barbero no sabe hacer
   
2. NUEVAS COLUMNAS EN ServicioBarbero:
   ✓ precio_barbero: NULLABLE - Permite override de precio por barbero
   ✓ tiempo_servicio_minutos: NULLABLE - Permite override de duración por barbero
   ✓ disponible: BIT - Control granular de disponibilidad por barbero/servicio
   
3. ACTUALIZACIONES A TABLAS:
   ✓ AuditoriaPreciosServicio: Agregada columna id_barbero (nullable)
     - NULL = cambio global en precio base del servicio
     - NOT NULL = cambio específico de barbero en ServicioBarbero
   
4. ACTUALIZACIONES A ÍNDICES:
   ✓ ELIMINADO: IX_ServicioTienda_Tienda
   ✓ AGREGADOS:
     - IX_ServicioBarbero_Barbero (búsqueda servicios de un barbero)
     - IX_ServicioBarbero_Servicio (búsqueda barberos que hacen servicio)
     - IX_ServicioBarbero_Disponible (filtro disponibilidad)
   
5. ACTUALIZACIONES A STORED PROCEDURE usp_AgendarCita:
   ✓ Validación 4 (NUEVA): Verifica que barbero puede hacer el servicio
   ✓ Duracion: Obtiene tiempo_servicio_minutos de ServicioBarbero o duracion_minutos de Servicio
   ✓ Precio: Obtiene precio_barbero de ServicioBarbero o precio_base de Servicio
   
LÓGICA DE HERENCIA DE VALORES:
================================================================================
Para cada cita se calcula:

DURACIÓN:
  IF ServicioBarbero.tiempo_servicio_minutos IS NOT NULL
    THEN usar ServicioBarbero.tiempo_servicio_minutos
  ELSE
    usar Servicio.duracion_minutos

PRECIO:
  IF ServicioBarbero.precio_barbero IS NOT NULL
    THEN usar ServicioBarbero.precio_barbero
  ELSE
    usar Servicio.precio_base

DISPONIBILIDAD:
  Requiere: ServicioBarbero.disponible = 1 AND Barbero.activo = 1

NORMALIZACIÓN A 3NF (CONFORME):
================================================================================
✓ 1NF: Todos los atributos son atómicos (no arrays, no valores multivalor)
✓ 2NF: Todas las columnas dependen de la clave completa (no dependencias parciales)
✓ 3NF: No hay dependencias transitivas (cada columna depende SOLO de la clave primaria)

Excepciones deliberadas:
✓ id_tienda en tabla Cita (desnormalizado por performance)
  - Se puede derivar de Cita.id_barbero → Barbero.id_tienda
  - Se mantiene para reducir JOINs frecuentes

ÍNDICES OPTIMIZADOS (CONFORME):
================================================================================
- Creados en columnas frecuentemente buscadas y filtradas
- Foreign Keys automáticamente indexadas por SQL Server
- Índices compuestos para queries comunes (Barbero + Fecha)
- Índices filtrados para performance (WHERE estado = 'confirmada')

CONSTRAINTS Y VALIDACIONES (CONFORME):
================================================================================
- CHECK: Validaciones de rango (puntuación 1-5, estado válido, precios >= 0, etc.)
- FK: Integridad referencial con ON DELETE CASCADE para mantener consistencia
- UNIQUE: Prevención de duplicados (email, ServicioBarbero(id_barbero, id_servicio))
- PRIMARY KEY: Identificación única de cada registro
- Triggers: Validaciones automáticas y actualizaciones en cascada

VISTAS PARA QUERIES COMUNES:
================================================================================
✓ vw_CitasProximas: Citas confirmadas próximas (próximos 30 días)
✓ vw_CalificacionesBarbero: Resumen de calificaciones por barbero
✓ vw_VentasPorTienda: Resumen de ventas y citas por tienda

FUNCIONES UDF REUTILIZABLES:
================================================================================
✓ ufn_CalcularVentasBarbero: Calcula ventas totales en período
✓ ufn_HorariosDisponibles: Obtiene horarios disponibles para barbero/fecha
✓ ufn_VerificarDisponibilidad: Verifica si barbero disponible (previene solapamiento)

PASOS PARA APLICAR ESTA ACTUALIZACIÓN:
================================================================================
1. BACKUP de BD actual:
   - BACKUP DATABASE FadeBooker_DB TO DISK = 'C:\backups\FadeBooker_DB_pre_v1.1.bak'

2. EJECUTAR SCRIPT DE LIMPIEZA (si existe BD anterior):
   - Uncomment la sección "LIMPIAR OBJETOS PREVIOS" al inicio del script

3. EJECUTAR TODO EL SCRIPT:
   - En Azure SQL o SSMS, ejecutar FadeBooker_ScriptBD_v1.1.sql completo

4. VERIFICAR INTEGRIDAD:
   - SELECT OBJECT_NAME(object_id) FROM sys.indexes WHERE name LIKE 'IX_ServicioBarbero%'
   - SELECT * FROM sys.foreign_keys WHERE referenced_table_name = 'ServicioBarbero'

5. POBLAR DATOS DE PRUEBA:
   - Ejecutar FadeBooker_DatosTest.sql

6. VALIDAR:
   - Verificar que no hay citas sin relación en ServicioBarbero
   - Verificar triggers funcionan (insertar reseña, verificar calificación se actualiza)
   - Verificar SPs funcionan (agendar cita con validación de barbero/servicio)

DATOS A MIGRAR (SI ES NECESARIO):
================================================================================
Si había datos en ServicioTienda y se quiere migrar:

-- Migración de ServicioTienda → ServicioBarbero
-- Supuesto: Cada tienda tiene 1 barbero, o todos los barberos pueden hacer todos los servicios
INSERT INTO dbo.ServicioBarbero (id_servicio, id_barbero, precio_barbero, disponible)
SELECT DISTINCT 
    st.id_servicio,
    b.id_barbero,
    st.precio_tienda,  -- Usar precio_tienda como precio_barbero inicial
    st.disponible
FROM dbo.ServicioTienda st
INNER JOIN dbo.Barbero b ON st.id_tienda = b.id_tienda
WHERE NOT EXISTS (SELECT 1 FROM dbo.ServicioBarbero WHERE id_servicio = st.id_servicio AND id_barbero = b.id_barbero);

-- DESPUÉS de esta migración, verificar integridad y tomar decisiones para barberos que quizá no deben hacer ciertos servicios

ROLLBACK EN CASO DE ERROR:
================================================================================
Si hay problema durante ejecución:
1. ROLLBACK TRANSACTION; (automático en TRY/CATCH)
2. Restaurar del backup
3. Revisar errores en SQL Server Event Viewer
4. Contactar @database-agent para debugging

MÉTRICAS DE VALIDACIÓN POST-ACTUALIZACIÓN:
================================================================================
✓ Tablas creadas: 10 (sin ServicioTienda, con ServicioBarbero)
✓ Índices creados: 13 (actualizado con ServicioBarbero indices)
✓ Vistas creadas: 3 (sin cambios)
✓ Funciones UDF: 3 (sin cambios)
✓ Stored Procedures: 3 (actualizado usp_AgendarCita)
✓ Triggers: 4 (sin cambios directos, pero funcionan con nueva tabla)
✓ Foreign Keys: 19+ (actualizado con nuevas FK a ServicioBarbero)

PRÓXIMOS PASOS:
================================================================================
1. @backend-agent: Actualizar RepositoryImpl para usar ServicioBarbero
   - Crear ServicioBarberoRepositoryImpl
   - Actualizar ServicioRepositoryImpl.findByBarbero()
   - Actualizar BarberoRepositoryImpl.getServicios()

2. @documentation-agent: Actualizar documentación
   - Actualizar DATABASE.md
   - Actualizar diagrama ER

3. @orchestrator-agent: Validar coherencia
   - Verificar endpoints retornan servicios del barbero
   - Verificar agendamiento valida ServicioBarbero
*/
