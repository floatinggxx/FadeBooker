const fs = require('fs');
const path = require('path');

const filePath = '/home/mauricio/Documentos/GitHub/FadeBooker/Producto/back-fadebooker/swagger_powerapps.json';

try {
    const data = fs.readFileSync(filePath, 'utf8');
    let swagger = JSON.parse(data);

    // 1. Eliminar TODAS las propiedades "example" en respuestas o definiciones
    // 2. Eliminar todas las propiedades "nullable": true
    // 3. Corregir parámetros "in": "body" eliminando "type"
    // 4. Corregir parámetros que NO sean de tipo "body" asegurándose de que no tengan "schema"
    // 5. Eliminar "content" en respuestas

    function cleanSchema(obj) {
        if (!obj || typeof obj !== 'object') return;

        // Regla 1: Eliminar "example"
        if (obj.hasOwnProperty('example')) {
            delete obj.example;
        }

        // Regla 2: Eliminar "nullable"
        if (obj.hasOwnProperty('nullable')) {
            delete obj.nullable;
        }

        // Recurrencia
        for (let key in obj) {
            if (typeof obj[key] === 'object') {
                cleanSchema(obj[key]);
            }
        }
    }

    // Procesar Paths
    if (swagger.paths) {
        for (let pathKey in swagger.paths) {
            for (let method in swagger.paths[pathKey]) {
                const operation = swagger.paths[pathKey][method];

                // Regla 4 & 3: Parámetros
                if (operation.parameters) {
                    operation.parameters.forEach(param => {
                        if (param.in === 'body') {
                            // Regla 3: in: body -> no type
                            if (param.hasOwnProperty('type')) {
                                delete param.type;
                            }
                        } else {
                            // Regla 4: in: != body -> no schema
                            if (param.hasOwnProperty('schema')) {
                                delete param.schema;
                            }
                        }
                        // También limpiar example y nullable en parámetros
                        cleanSchema(param);
                    });
                }

                // Regla 5 & 1: Respuestas
                if (operation.responses) {
                    for (let statusCode in operation.responses) {
                        const response = operation.responses[statusCode];
                        
                        // Regla 5: content -> no soportado en 2.0 (OpenAPI 3.0 only)
                        // Si existe content y tiene un esquema, moverlo a schema directo
                        if (response.content) {
                            const mediaTypes = Object.keys(response.content);
                            if (mediaTypes.length > 0) {
                                const firstMedia = response.content[mediaTypes[0]];
                                if (firstMedia.schema) {
                                    response.schema = firstMedia.schema;
                                }
                            }
                            delete response.content;
                        }

                        cleanSchema(response);
                    }
                }
            }
        }
    }

    // Procesar Definiciones
    if (swagger.definitions) {
        for (let defName in swagger.definitions) {
            cleanSchema(swagger.definitions[defName]);
        }
    }

    // Guardar los cambios
    fs.writeFileSync(filePath, JSON.stringify(swagger, null, 2), 'utf8');
    console.log('Swagger file cleaned successfully.');

} catch (err) {
    console.error('Error processing swagger file:', err);
    process.exit(1);
}
