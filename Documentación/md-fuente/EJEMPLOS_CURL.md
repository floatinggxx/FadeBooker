# 🔧 FadeBooker Backend - Ejemplos de cURL

**Base URL:** `http://localhost:3000/api`

---

## 👤 USUARIOS

### Registrar Usuario

```bash
curl -X POST http://localhost:3000/api/usuarios/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "contrasena": "password123",
    "nombre": "Juan",
    "apellido": "Pérez",
    "telefono": "123456789",
    "rol": "Cliente"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "contrasena": "password123"
  }'
```

---

## 💈 BARBEROS

### Crear Barbero

```bash
curl -X POST http://localhost:3000/api/barberos \
  -H "Content-Type: application/json" \
  -d '{
    "id_usuario": 2,
    "id_tienda": 1,
    "nombre": "Carlos",
    "apellido": "García",
    "email": "carlos@barberia.com",
    "telefono": "987654321",
    "especialidad": "Degradados",
    "anos_experiencia": 5,
    "tarifa_base": 50.00,
    "activo": true
  }'
```

### Listar Todos los Barberos

```bash
curl -X GET http://localhost:3000/api/barberos
```

### Obtener Barbero por ID

```bash
curl -X GET http://localhost:3000/api/barberos/1
```

### Obtener Barbero por Email

```bash
curl -X GET http://localhost:3000/api/barberos/email/carlos@barberia.com
```

### Buscar Barberos por Especialidad

```bash
curl -X GET http://localhost:3000/api/barberos/especialidad/Degradados
```

### Actualizar Barbero

```bash
curl -X PUT http://localhost:3000/api/barberos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Carlos Miguel",
    "especialidad": "Degradados y Clásico",
    "anos_experiencia": 6,
    "tarifa_base": 55.00
  }'
```

### Actualizar Horario

```bash
curl -X PUT http://localhost:3000/api/barberos/1/horario \
  -H "Content-Type: application/json" \
  -d '{
    "horario": {
      "lunes": { "inicio": "09:00", "fin": "18:00" },
      "martes": { "inicio": "09:00", "fin": "18:00" },
      "miercoles": { "inicio": "09:00", "fin": "18:00" },
      "jueves": { "inicio": "09:00", "fin": "18:00" },
      "viernes": { "inicio": "09:00", "fin": "20:00" },
      "sabado": { "inicio": "10:00", "fin": "16:00" },
      "domingo": null
    }
  }'
```

### Obtener Disponibilidad

```bash
curl -X GET http://localhost:3000/api/barberos/1/disponibilidad/2026-05-15
```

### Listar Servicios de un Barbero

```bash
curl -X GET http://localhost:3000/api/barberos/1/servicios
```

### Agregar Servicio a Barbero

```bash
curl -X POST http://localhost:3000/api/barberos/1/servicios \
  -H "Content-Type: application/json" \
  -d '{
    "id_servicio": 3,
    "precio_barbero": 60.00,
    "tiempo_servicio_minutos": 40
  }'
```

### Remover Servicio de Barbero

```bash
curl -X DELETE http://localhost:3000/api/barberos/1/servicios/3
```

### Eliminar Barbero

```bash
curl -X DELETE http://localhost:3000/api/barberos/1
```

---

## 👥 CLIENTES

### Crear Cliente

```bash
curl -X POST http://localhost:3000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "id_usuario": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "telefono": "123456789",
    "puntos_acumulados": 0,
    "activo": true
  }'
```

### Listar Todos los Clientes

```bash
curl -X GET http://localhost:3000/api/clientes
```

### Obtener Cliente por ID

```bash
curl -X GET http://localhost:3000/api/clientes/1
```

### Obtener Cliente por Email

```bash
curl -X GET http://localhost:3000/api/clientes/email/juan@example.com
```

### Buscar Cliente por Nombre

```bash
curl -X GET "http://localhost:3000/api/clientes/buscar?nombre=Juan"
```

### Buscar Cliente por Teléfono

```bash
curl -X GET http://localhost:3000/api/clientes/telefono/123456789
```

### Actualizar Cliente

```bash
curl -X PUT http://localhost:3000/api/clientes/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Carlos",
    "telefono": "987654321",
    "activo": true
  }'
```

### Actualizar Puntos

```bash
curl -X PUT http://localhost:3000/api/clientes/1/puntos \
  -H "Content-Type: application/json" \
  -d '{
    "puntos": 250
  }'
```

### Eliminar Cliente

```bash
curl -X DELETE http://localhost:3000/api/clientes/1
```

---

## 🗂️ SERVICIOS

### Crear Servicio

```bash
curl -X POST http://localhost:3000/api/servicios \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_servicio": "Corte Degradado Premium",
    "descripcion": "Corte moderno con degradado y detalles premium",
    "duracion_minutos": 45,
    "precio_base": 60.00,
    "activo": true
  }'
```

### Listar Todos los Servicios

```bash
curl -X GET http://localhost:3000/api/servicios
```

### Obtener Servicio por ID

```bash
curl -X GET http://localhost:3000/api/servicios/1
```

### Buscar Servicio por Nombre

```bash
curl -X GET "http://localhost:3000/api/servicios/buscar?nombre=Corte"
```

### Actualizar Servicio

```bash
curl -X PUT http://localhost:3000/api/servicios/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_servicio": "Corte Clásico Deluxe",
    "duracion_minutos": 35,
    "precio_base": 55.00
  }'
```

### Eliminar Servicio

```bash
curl -X DELETE http://localhost:3000/api/servicios/1
```

### Obtener Barberos que Hacen un Servicio

```bash
curl -X GET http://localhost:3000/api/servicios/1/barberos
```

### Obtener Precio Efectivo (v1.10.0)

```bash
curl -X GET http://localhost:3000/api/servicios/1/1/precio
```

### Obtener Duración Efectiva (v1.10.0)

```bash
curl -X GET http://localhost:3000/api/servicios/1/1/duracion
```

---

## 📅 CITAS

### Agendar Cita

```bash
curl -X POST http://localhost:3000/api/citas \
  -H "Content-Type: application/json" \
  -d '{
    "id_cliente": 1,
    "id_barbero": 1,
    "id_servicio": 1,
    "fecha_hora_inicio": "2026-05-15T14:00:00Z",
    "pago_abono": 15.00,
    "metodo_pago": "tarjeta",
    "notas": "Preferencia: línea recta en detalles"
  }'
```

### Obtener Detalles de Cita

```bash
curl -X GET http://localhost:3000/api/citas/5
```

### Cambiar Estado de Cita

```bash
curl -X PUT http://localhost:3000/api/citas/5/estado \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "completada"
  }'
```

---

## ✂️ HAIRSTYLE

### Generar Firma para Cloudinary

```bash
curl -X POST http://localhost:3000/api/hairstyle/signature \
  -H "Content-Type: application/json" \
  -d '{
    "folder": "user_photos"
  }'
```

### Simular Corte de Pelo

```bash
curl -X POST http://localhost:3000/api/hairstyle/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "publicId": "user_photos/photo_123",
    "styleId": "degradado"
  }'
```

---

## 📊 Ejemplos de Flujo Completo

### Flujo 1: Cliente se registra y agenda cita

```bash
# 1. Crear usuario
curl -X POST http://localhost:3000/api/usuarios/register \
  -H "Content-Type: application/json" \
  -d '{"email":"nuevo@example.com","contrasena":"pass123","nombre":"Pedro","apellido":"López","telefono":"111222333","rol":"Cliente"}'

# 2. Crear cliente
curl -X POST http://localhost:3000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{"id_usuario":1,"nombre":"Pedro","apellido":"López","email":"nuevo@example.com","telefono":"111222333","puntos_acumulados":0,"activo":true}'

# 3. Ver barberos disponibles
curl -X GET http://localhost:3000/api/barberos

# 4. Ver servicios disponibles
curl -X GET http://localhost:3000/api/servicios

# 5. Ver disponibilidad del barbero
curl -X GET http://localhost:3000/api/barberos/1/disponibilidad/2026-05-15

# 6. Agendar cita
curl -X POST http://localhost:3000/api/citas \
  -H "Content-Type: application/json" \
  -d '{"id_cliente":1,"id_barbero":1,"id_servicio":1,"fecha_hora_inicio":"2026-05-15T14:00:00Z","pago_abono":15.00,"metodo_pago":"tarjeta"}'
```

### Flujo 2: Admin configura servicios por barbero

```bash
# 1. Crear servicio
curl -X POST http://localhost:3000/api/servicios \
  -H "Content-Type: application/json" \
  -d '{"nombre_servicio":"Corte Degradado","descripcion":"Premium","duracion_minutos":45,"precio_base":60.00,"activo":true}'

# 2. Asignar servicio a barbero con override
curl -X POST http://localhost:3000/api/barberos/1/servicios \
  -H "Content-Type: application/json" \
  -d '{"id_servicio":1,"precio_barbero":65.00,"tiempo_servicio_minutos":50}'

# 3. Ver servicios del barbero
curl -X GET http://localhost:3000/api/barberos/1/servicios

# 4. Verificar precio efectivo
curl -X GET http://localhost:3000/api/servicios/1/1/precio
```

### Flujo 3: Cliente simula cortes

```bash
# 1. Obtener firma de Cloudinary
curl -X POST http://localhost:3000/api/hairstyle/signature \
  -H "Content-Type: application/json" \
  -d '{"folder":"user_photos"}'

# (Usar firma para subir foto a Cloudinary desde frontend)

# 2. Simular corte degradado
curl -X POST http://localhost:3000/api/hairstyle/simulate \
  -H "Content-Type: application/json" \
  -d '{"publicId":"user_photos/photo_456","styleId":"degradado"}'

# 3. Simular corte clásico
curl -X POST http://localhost:3000/api/hairstyle/simulate \
  -H "Content-Type: application/json" \
  -d '{"publicId":"user_photos/photo_456","styleId":"clasico"}'

# 4. Simular corte moderno
curl -X POST http://localhost:3000/api/hairstyle/simulate \
  -H "Content-Type: application/json" \
  -d '{"publicId":"user_photos/photo_456","styleId":"moderno"}'
```

---

## 🧪 Testing con Postman/Insomnia

### Importar como cURL en Postman:
1. Copiar comando cURL
2. Abrir Postman → File → Import
3. Pegar en la sección "Raw text"
4. Click "Import"

### Variables útiles para reutilizar:

```
{{base_url}} = http://localhost:3000/api
{{client_id}} = 1
{{barber_id}} = 1
{{service_id}} = 1
{{appointment_id}} = 5
```

### Usar variables en cURL:

```bash
curl -X GET {{base_url}}/clientes/{{client_id}}
```

---

## 📝 Notas

- Reemplazar `localhost` con la IP/dominio del servidor en producción
- Incluir header `Authorization: Bearer <token>` cuando JWT se implemente
- Todas las fechas deben estar en formato ISO 8601: `YYYY-MM-DDTHH:mm:ssZ`
- IDs numéricos deben ser enteros
- Precios deben ser números decimales (ej: 50.00)

---

**Última actualización:** 29/04/2026
