const fs = require('fs');

const swagger = JSON.parse(fs.readFileSync('swagger.json', 'utf8'));

swagger.swagger = "2.0";
delete swagger.openapi;

if (swagger.servers && swagger.servers.length > 0) {
  const url = new URL(swagger.servers[0].url);
  swagger.host = url.host;
  swagger.basePath = url.pathname;
  swagger.schemes = ["https"];
}
delete swagger.servers;

// ... resto del procesamiento igual que el original ...

if (swagger.components) {
  if (swagger.components.schemas) {
    swagger.definitions = swagger.components.schemas;
  }
  if (swagger.components.securitySchemes) {
    swagger.securityDefinitions = swagger.components.securitySchemes;
    if (swagger.securityDefinitions.BearerAuth) {
        swagger.securityDefinitions.BearerAuth = {
            type: "apiKey",
            name: "Authorization",
            in: "header",
            description: "Ingrese: Bearer <token>"
        };
    }
  }
  delete swagger.components;
}

let jsonStr = JSON.stringify(swagger, null, 2);
jsonStr = jsonStr.replace(/#\/components\/schemas\//g, '#/definitions/');

fs.writeFileSync('swagger_powerapps.json', jsonStr);
console.log('Swagger 2.0 generado con éxito en swagger_powerapps.json');
const fs = require('fs');

const swagger = JSON.parse(fs.readFileSync('swagger.json', 'utf8'));

// 1. Cambiar versión
swagger.swagger = "2.0";
delete swagger.openapi;

// 2. Mover servers a host/basePath/schemes
if (swagger.servers && swagger.servers.length > 0) {
  const url = new URL(swagger.servers[0].url);
  swagger.host = url.host;
  swagger.basePath = url.pathname;
  swagger.schemes = ["https"];
}
delete swagger.servers;

// 3. Corregir errores de 'description' faltantes y convertir content a schema
for (const [path, methods] of Object.entries(swagger.paths)) {
  for (const [method, detail] of Object.entries(methods)) {
    if (detail.responses) {
      for (const [code, res] of Object.entries(detail.responses)) {
        if (!res.description) {
          res.description = "Operación exitosa";
        }
        if (res.content && res.content['application/json']) {
          res.schema = res.content['application/json'].schema;
          if (res.content['application/json'].example) {
            res.example = res.content['application/json'].example;
          }
          delete res.content;
        }
      }
    }
    if (detail.requestBody) {
      if (!detail.parameters) detail.parameters = [];
      const content = detail.requestBody.content['application/json'];
      detail.parameters.push({
        name: "body",
        in: "body",
        required: detail.requestBody.required || false,
        schema: content.schema
      });
      delete detail.requestBody;
    }
    if (detail.parameters) {
      detail.parameters.forEach(p => {
        if (p.schema) {
          if (p.schema.type) p.type = p.schema.type;
          if (p.schema.format) p.format = p.schema.format;
          if (p.schema.enum) p.enum = p.schema.enum;
          if (p.schema['$ref']) p.schema = { '$ref': p.schema['$ref'] };
          if (p.in !== 'body') delete p.schema;
        }
      });
    }
  }
}

// 4. Mover components/schemas a definitions
if (swagger.components) {
  if (swagger.components.schemas) {
    swagger.definitions = swagger.components.schemas;
  }
  if (swagger.components.securitySchemes) {
    swagger.securityDefinitions = swagger.components.securitySchemes;
    if (swagger.securityDefinitions.BearerAuth) {
        swagger.securityDefinitions.BearerAuth = {
            type: "apiKey",
            name: "Authorization",
            in: "header",
            description: "Ingrese: Bearer <token>"
        };
    }
  }
  delete swagger.components;
}

let jsonStr = JSON.stringify(swagger, null, 2);
jsonStr = jsonStr.replace(/#\/components\/schemas\//g, '#/definitions/');

fs.writeFileSync('swagger_powerapps.json', jsonStr);
console.log('Swagger 2.0 generado con éxito en swagger_powerapps.json');
