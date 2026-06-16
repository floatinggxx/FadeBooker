const fs = require('fs');
const swagger = JSON.parse(fs.readFileSync('swagger.json', 'utf8'));

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

// ... el resto igual al original ...

for (const [path, methods] of Object.entries(swagger.paths)) {
  for (const [method, detail] of Object.entries(methods)) {
    const opId = method + path.replace(/\//g, '_').replace(/{/g, '').replace(/}/g, '');
    if (!detail.operationId) detail.operationId = opId;
  }
}

fs.writeFileSync('swagger.json', JSON.stringify(swagger, null, 2));
console.log('Main swagger.json actualizado con ejemplos.');
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

fs.writeFileSync('swagger.json', JSON.stringify(swagger, null, 2));
console.log('Main swagger.json actualizado con ejemplos.');
