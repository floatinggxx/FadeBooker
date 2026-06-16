Modelo de Negocio y Estrategia de Monetización — Versión Adaptada (Cambio de comisión a 5%)

Proyecto: FadeBooker
Versión: 2.1 (Adaptación de comisión)
Fecha: Junio 2026

Resumen de cambio:
- Motivo: Se decidió reducir la comisión por transacción aplicada a barberías en plan gratuito desde el 10% (documento original) al 5% para mejorar la adopción y competitividad durante la fase de crecimiento.
- Alcance: Esta versión actualiza únicamente la política de comisión en la documentación del negocio. El equipo técnico ha optado por mantener temporalmente la lógica existente del backend (5%) o actualizarla según coordinación posterior.
- Acción requerida: Coordinar con el equipo técnico para garantizar que la configuración del backend (valor por defecto en `COMMISSION_RATE` o tabla de configuración en BD) coincida con este documento.

1. Política de comisión (actualizada)
- Comisión por transacción: Se aplica un 5% sobre el valor de cada reserva realizada a través de la plataforma para barberías en plan gratuito.
- Exención: Las barberías con plan de pago activo están exentas del cobro de la comisión mientras su suscripción esté vigente.

2. Razonamiento y efectos esperados
- Lowering the commission to 5% reduces friction for barberías y aumenta la probabilidad de adopción en mercados sensibles al precio.
- El objetivo es acelerar la captación en la Fase 1 y permitir pruebas de crecimiento más agresivas mediante tarifas más competitivas.
- Se recomienda monitorear la conversión de barberías a suscripciones y el ARPU durante 3 meses para evaluar impacto.

3. Implementación operacional
- Responsable: Producto/COO comunica el cambio a Soporte y Marketing.
- Técnico: Backend debe exponer `COMMISSION_RATE` configurable y/o una tabla `Configuracion` en BD con la clave `commission_rate`.
- Tests: Actualizar pruebas unitarias que validen cálculo de comisiones a 5% por defecto.

4. Historial de versiones
- 2.0 — Documento original (10% comisión)
- 2.1 — Adaptación: comisión reducida a 5% (este documento)

Notas finales:
- Este documento actúa como la fuente de verdad para la política comercial mientras no exista una aprobación formal posterior que revierta o modifique la tasa.
- Si se aprueba un cambio en la plataforma (por ejemplo, exenciones especiales o promociones temporales), se debe versionar y registrar en esta carpeta con una nota de aprobación (usuario y fecha).
