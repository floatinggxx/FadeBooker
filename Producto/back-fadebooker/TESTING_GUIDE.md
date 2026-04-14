# 🧪 Guía de Testing - FadeBooker Backend

**Última actualización:** 14 de abril de 2026  
**Framework:** Jest  
**Status:** ✅ Configurado y listo para usar

---

## 📋 Tabla de Contenidos

1. [Instalación](#instalación)
2. [Configuración](#configuración)
3. [Ejecutar Tests](#ejecutar-tests)
4. [Estructura de Tests](#estructura-de-tests)
5. [Escribir Tests](#escribir-tests)
6. [Cobertura](#cobertura)
7. [Mejores Prácticas](#mejores-prácticas)

---

## 🚀 Instalación

### 1. Instalar Jest y dependencias

```bash
cd Producto/back-fadebooker
npm install --save-dev jest supertest
```

**Dependencias instaladas:**
- `jest@^29.7.0` - Framework de testing
- `supertest@^6.3.3` - Test HTTP requests

### 2. Verificar instalación

```bash
npm test --version
npx jest --version
```

Debería mostrar: `jest {version}`

---

## ⚙️ Configuración

### Archivos de Configuración

#### `jest.config.js`
Define la configuración global de Jest:
- Entorno: Node.js
- Reporte de cobertura: 50% mínimo
- Timeout: 10 segundos
- Setup: `tests/setup.js`

#### `tests/setup.js`
Se ejecuta una vez antes de las pruebas. Configura:
- Timeout global
- Variables de entorno
- Mocks globales (opcional)

#### `package.json` (scripts)
```json
{
  "scripts": {
    "test": "jest --verbose --coverage",
    "test:watch": "jest --watch",
    "test:unit": "jest tests/unit --verbose",
    "test:integration": "jest tests/integration --verbose"
  }
}
```

---

## 🏃 Ejecutar Tests

### 1. Ejecutar todos los tests

```bash
npm test
```

Salida esperada:
```
 PASS  tests/unit/usuario.model.test.js
 PASS  tests/unit/barbero.model.test.js
 PASS  tests/unit/resena.model.test.js

Test Suites: 3 passed, 3 total
Tests:       50 passed, 50 total
Snapshots:   0 total
Time:        2.5s
```

### 2. Ejecutar solo tests unitarios

```bash
npm run test:unit
```

### 3. Ejecutar solo tests de integración

```bash
npm run test:integration
```

### 4. Modo watch (re-ejecuta al cambiar archivos)

```bash
npm run test:watch
```

### 5. Tests con cobertura

```bash
npm test
```

Genera reporte en `coverage/index.html`

### 6. Ejecutar un test específico

```bash
npx jest tests/unit/usuario.model.test.js
```

---

## 📁 Estructura de Tests

```
tests/
├── setup.js                    (Setup global)
├── unit/                       (Tests unitarios)
│   ├── usuario.model.test.js
│   ├── barbero.model.test.js
│   ├── resena.model.test.js
│   ├── cita.model.test.js      (Pendiente)
│   ├── cliente.model.test.js   (Pendiente)
│   └── servicios/              (Tests de servicios)
│       ├── usuario.service.test.js
│       ├── barbero.service.test.js
│       ├── cita.service.test.js
│       └── ...
├── integration/                (Tests de integración)
│   ├── usuarios.integration.test.js
│   ├── barberos.integration.test.js
│   └── citas.integration.test.js
└── fixtures/                   (Datos de prueba)
    ├── usuarios.json
    ├── barberos.json
    └── citas.json
```

---

## ✍️ Escribir Tests

### Estructura Básica de un Test

```javascript
// tests/unit/ejemplo.test.js
const MiModelo = require('../../src/domain/entities/MiModelo')

describe('MiModelo', () => {
  describe('Constructor', () => {
    test('debe crear instancia con campos correctos', () => {
      const data = { id: 1, nombre: 'Test' }
      const instancia = new MiModelo(data)
      
      expect(instancia.id).toBe(1)
      expect(instancia.nombre).toBe('Test')
    })
  })

  describe('Validaciones', () => {
    test('debe validar campo requerido', () => {
      const data = { nombre: 'Test' } // Falta id
      const instancia = new MiModelo(data)
      
      expect(instancia.id).toBeUndefined()
    })
  })
})
```

### Matchers Comunes

```javascript
// Igualdad
expect(value).toBe(expected)              // ===
expect(value).toEqual(expected)           // profundo

// Booleanos
expect(value).toBeTruthy()
expect(value).toBeFalsy()

// Números
expect(value).toBeGreaterThan(5)
expect(value).toBeGreaterThanOrEqual(5)
expect(value).toBeLessThan(5)
expect(value).toBeLessThanOrEqual(5)

// Strings
expect(value).toMatch(/regex/)
expect(value).toContain('substring')

// Arrays
expect(array).toContain(item)
expect(array).toHaveLength(3)

// Objetos
expect(obj).toHaveProperty('prop')
expect(obj).toHaveProperty('prop', value)

// Tipos
expect(value).toBeDefined()
expect(value).toBeUndefined()
expect(value).toBeNull()
expect(value).toBeInstanceOf(Class)

// Funciones
expect(() => func()).toThrow()
expect(() => func()).toThrow(Error)

// Nulidad
expect(value).not.toBe(null)
```

### Tests Asincronos

```javascript
// Test con Promise
test('debe hacer fetch', () => {
  return fetch('/api/users')
    .then(response => response.json())
    .then(data => expect(data).toHaveLength(3))
})

// Test con async/await
test('debe hacer fetch', async () => {
  const response = await fetch('/api/users')
  const data = await response.json()
  expect(data).toHaveLength(3)
})

// Test con done callback
test('debe hacer fetch', (done) => {
  fetch('/api/users')
    .then(res => res.json())
    .then(data => {
      expect(data).toHaveLength(3)
      done()
    })
})
```

---

## 📊 Cobertura

### Ver Reporte de Cobertura

```bash
npm test
```

Genera `coverage/index.html`. Abre en navegador para ver:
- Cobertura por archivo
- Líneas no cubiertas
- Branches no testeados

### Umbrales Mínimos (configurados)

En `jest.config.js`:
```javascript
coverageThreshold: {
  global: {
    branches: 50,      // 50% de ramas
    functions: 50,     // 50% de funciones
    lines: 50,         // 50% de líneas
    statements: 50     // 50% de sentencias
  }
}
```

Aumentar umbrales:
```javascript
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80
  }
}
```

---

## 🏆 Mejores Prácticas

### 1. Organización

✅ **Hacer:**
```javascript
describe('Usuario', () => {
  describe('Constructor', () => { ... })
  describe('Validaciones', () => { ... })
  describe('Sincronización con BD', () => { ... })
})
```

❌ **No hacer:**
```javascript
describe('Tests de usuario model', () => {
  test('test 1', () => { ... })
  test('test 2', () => { ... })
})
```

### 2. Nombres Descriptivos

✅ **Hacer:**
```javascript
test('debe crear usuario con email válido', () => { ... })
test('debe rechazar email sin dominio', () => { ... })
test('debe sincronizar foto_perfil_url con BD', () => { ... })
```

❌ **No hacer:**
```javascript
test('test 1', () => { ... })
test('debería funcionar', () => { ... })
test('CRUD test', () => { ... })
```

### 3. Arrange-Act-Assert (AAA)

```javascript
test('debe actualizar usuario', () => {
  // ARRANGE - Preparar datos
  const usuarioData = { id: 1, nombre: 'Juan' }
  
  // ACT - Ejecutar acción
  const usuario = new Usuario(usuarioData)
  
  // ASSERT - Verificar resultado
  expect(usuario.nombre).toBe('Juan')
})
```

### 4. Un Assert Principal

✅ **Hacer:**
```javascript
test('debe validar foto_perfil_url', () => {
  const usuario = new Usuario({ foto_perfil_url: 'url' })
  expect(usuario.foto_perfil_url).toBe('url')
})
```

❌ **No hacer:**
```javascript
test('usuario debe funcionar', () => {
  const usuario = new Usuario({...})
  expect(usuario.id).toBeDefined()
  expect(usuario.email).toBeDefined()
  // 20 más asserts aquí
})
```

### 5. DRY - Tests

```javascript
// ✅ Usar beforeEach para setup común
describe('Usuario', () => {
  let usuarioData

  beforeEach(() => {
    usuarioData = {
      id: 1,
      email: 'test@example.com',
      nombre: 'Juan'
    }
  })

  test('test 1', () => {
    const usuario = new Usuario(usuarioData)
    expect(usuario.id).toBe(1)
  })

  test('test 2', () => {
    const usuario = new Usuario(usuarioData)
    expect(usuario.email).toBe('test@example.com')
  })
})
```

### 6. Fixtures y Factories

```javascript
// tests/fixtures/usuarios.json
{
  "valid": {
    "id": 1,
    "email": "test@example.com",
    "nombre": "Juan"
  },
  "invalid": {
    "email": "invalid"
  }
}

// En test:
const fixtures = require('../fixtures/usuarios.json')
const usuario = new Usuario(fixtures.valid)
```

---

## 🔄 Workflow de Testing

### Patrón TDD (Test-Driven Development)

1. **RED**: Escribir test que falla
   ```javascript
   test('debe tener especialidad', () => {
     const barbero = new Barbero({...})
     expect(barbero.especialidad).toBeDefined() // FALLA
   })
   ```

2. **GREEN**: Hacer pasar el test
   ```javascript
   // Agregar campo en Barbero
   this.especialidad = especialidad
   // Test PASA
   ```

3. **REFACTOR**: Mejorar código
   ```javascript
   // Optimizar, limpiar
   ```

---

## 📝 Tests Actuales

### Modelos Testeados ✅

- ✅ **Usuario** (12 tests)
  - Constructor completo
  - Sincronización foto_perfil_url (typo corregido)
  - Validaciones de campos
  - Tipos de datos

- ✅ **Barbero** (15 tests)
  - Constructor con especialidad (campo agregado)
  - Herencia de Usuario
  - Campos de Barbero específicos
  - Especialidades válidas
  - Tipos de datos

- ✅ **Reseña** (20 tests)
  - id_cliente en lugar de id_usuario (corregido)
  - puntuacion en lugar de calificacion (corregido)
  - id_barbero agregado
  - id_tienda agregado
  - fecha_resena agregada
  - Validaciones de puntuación
  - Relaciones de BD

**Total de tests:** 47+ tests unitarios

---

## 🚀 Próximos Pasos

### Agregar Tests Para

- [ ] Cita model (20 tests)
- [ ] Cliente model (15 tests)
- [ ] Servicio model (12 tests)
- [ ] Tests de servicios/use cases (30 tests)
- [ ] Tests de repositorios (25 tests)
- [ ] Tests de integración (20 tests)

### Objetivo

- ✅ 80%+ cobertura de código
- ✅ Todos los modelos con tests
- ✅ Todos los endpoints con tests de integración
- ✅ CI/CD + tests automáticos

---

## 📞 Comandos Rápidos

```bash
# Instalar
npm install --save-dev jest supertest

# Ejecutar
npm test                        # Todos con cobertura
npm run test:watch             # Modo watch
npm run test:unit              # Solo unitarios
npm run test:integration       # Solo integración

# Específico
npx jest usuario.model.test.js  # Un archivo
npx jest --testNamePattern="debe sincronizar"  # Por nombre

# Cobertura
npm test -- --coverage         # Reporte completo
npm test -- --coverage --collectCoverageFrom="src/**/*.js"

# Debug
node --inspect-brk node_modules/.bin/jest --runInBand
```

---

## 📚 Referencias

- [Jest oficial](https://jestjs.io/)
- [Supertest](https://github.com/visionmedia/supertest)
- [TDD Best Practices](https://www.jestjs.io/docs/tutorial-react)
- [Testing en Node.js](https://nodejs.org/en/docs/guides/testing/)

---

**¿Necesitas ayuda?**
- Revisa ejemplos en `tests/unit/`
- Ejecuta `npm test` para ver resultados
- Consulta la documentación de Jest

**Happy Testing! 🚀**
