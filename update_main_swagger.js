const fs = require('fs');
const swagger = JSON.parse(fs.readFileSync('swagger.json', 'utf8'));

// Añadir ejemplos a schemas de OpenAPI 3.0
const schemas = swagger.components.schemas;

schemas.UsuarioRegistro.example = {
  email: "nuevo_cliente@example.com",
  contrasena: "<REPLACE_WITH_SECURE_PASSWORD>",
  nombre: "Juan",
  apellido: "Perez",
  telefono: "+56912345678",
  rol: "Cliente"
};

schemas.LoginRequest.example = {
  email: "admin@fadebooker.com",
  contrasena: "<REPLACE_WITH_SECURE_PASSWORD>"
};

schemas.ClienteInput.example = {
  id_usuario: 10,
  nombre: "Carlos",
  apellido: "Garcia",
  email: "carlos.g@example.com",
  telefono: "987654321"
};

schemas.BarberoInput.example = {
  id_usuario: 5,
  id_tienda: 1,
  nombre: "Marcos",
  apellido: "Trim",
  email: "marcos.barber@example.com",
  telefono: "5551234",
  especialidad: "Degradados y Barba",
  anos_experiencia: 4,
  tarifa_base: 15000
};

schemas.CitaInput.example = {
  id_cliente: 1,
  id_barbero: 2,
  id_servicio: 1,
  fecha_hora_inicio: "2026-05-20T15:00:00Z",
  pago_abono: 5000,
  metodo_pago: "Transferencia",
  notas: "Corte degradado con barba"
};

schemas.PagoCrear.example = {
  id_cita: 1,
  monto: 15000,
  descripcion: "Pago por servicio de barbería - Corte degradado",
  email_cliente: "cliente@example.com"
};

schemas.PagoResponse.example = {
  id_pago: "123456789",
  init_point: "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=123456789",
  status: "pending"
};

schemas.PagoDetalle.example = {
  id_pago: 1,
  id_cita: 1,
  monto: 15000,
  estado: "approved",
  fecha_creacion: "2026-05-20T14:30:00Z",
  fecha_actualizacion: "2026-05-20T14:35:00Z",
  referencia_mp: "123456789"
};

// Asegurar operationIds en el main swagger también para consistencia
for (const [path, methods] of Object.entries(swagger.paths)) {
  for (const [method, detail] of Object.entries(methods)) {
    const opId = method + path.replace(/\//g, '_').replace(/{/g, '').replace(/}/g, '');
    if (!detail.operationId) detail.operationId = opId;
  }
}

fs.writeFileSync('swagger.json', JSON.stringify(swagger, null, 2));
console.log('Main swagger.json actualizado con ejemplos.');
