# ⚡ Quick Reference - Jest Testing

**Herramienta:** Jest 29.7.0  
**Framework:** Node.js  
**Status:** ✅ Configurado en el backend

---

## 🚀 Comandos Rápidos

### Ejecutar Tests

```bash
# Todos los tests con cobertura
npm test

# Solo tests unitarios
npm run test:unit

# Solo tests de integración
npm run test:integration

# Modo watch (re-ejecuta al cambiar archivos)
npm run test:watch

# Un archivo específico
npx jest tests/unit/usuario.model.test.js

# Tests que coinciden con un patrón
npx jest --testNamePattern="debe sincronizar"

# Con salida detallada
npx jest --verbose

# Sin stop en primer error
npx jest --bail=false
```

---

## 📊 Cobertura

```bash
# Ver cobertura
npm test

# Abrir reporte HTML
open coverage/index.html  # macOS
xdg-open coverage/index.html  # Linux
start coverage/index.html  # Windows
```

---

## 📝 Archivos de Test

| Archivo | Tests | Status |
|---------|-------|--------|
| `usuario.model.test.js` | 12 | ✅ |
| `barbero.model.test.js` | 15 | ✅ |
| `resena.model.test.js` | 20 | ✅ |
| `barberoRepository.test.js` | 5 | ✅ |

**Total de tests:** 52

---

## 🧪 Ejemplos de Tests

### Test Básico
```javascript
test('debe crear usuario', () => {
  const user = new Usuario({ id: 1, email: 'test@example.com' })
  expect(user.email).toBe('test@example.com')
})
```

### Test con Setup
```javascript
describe('Usuario', () => {
  let usuario

  beforeEach(() => {
    usuario = new Usuario({ id: 1, email: 'test@example.com' })
  })

  test('debe tener email', () => {
    expect(usuario.email).toBe('test@example.com')
  })
})
```

### Test Sincronización BD
```javascript
test('debe tener campo foto_perfil_url sincronizado', () => {
  const user = new Usuario({ foto_perfil_url: 'url' })
  expect(user.foto_perfil_url).toBe('url')
  expect(user.foto_perfil_url).toBeDefined()
})
```

---

## ✔️ Matchers Útiles

```javascript
// Igualdad
expect(value).toBe(expected)
expect(value).toEqual(expected)

// Booleanos
expect(value).toBeTruthy()
expect(value).toBeFalsy()

// Números
expect(value).toBeGreaterThan(5)
expect(value).toBeLessThan(5)

// Strings
expect(text).toContain('substring')
expect(text).toMatch(/regex/)

// Arrays
expect(array).toContain(item)
expect(array).toHaveLength(3)

// Objetos
expect(obj).toHaveProperty('prop')
expect(obj).toHaveProperty('prop', value)

// Tipos
expect(value).toBeDefined()
expect(value).toBeUndefined()
expect(typeof value).toBe('string')
```

---

## 🏗️ Estructura Proyecto Tests

```
tests/
├── setup.js                          ← Configuración global
├── unit/                             ← Tests unitarios
│   ├── usuario.model.test.js         ✅ 12 tests
│   ├── barbero.model.test.js         ✅ 15 tests
│   ├── resena.model.test.js          ✅ 20 tests
│   └── barberoRepository.test.js    ✅ 5 tests
├── integration/                      ← Tests de integración (futuro)
│   └── (por crear)
└── fixtures/                         ← Datos de prueba (futuro)
    └── (por crear)
```

---

## 🔧 Configuración

**jest.config.js:**
```javascript
{
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: ['src/**/*.js'],
  coverageThreshold: { global: { lines: 50 } }
}
```

---

## 📋 Checklist antes de Commit

- [ ] `npm test` pasa
- [ ] Cobertura > 50%
- [ ] No hay warnings
- [ ] Tests son descriptivos
- [ ] Cambios en BD = test nuevo

---

## 🎯 Lo que Se Está Testeando

### ✅ Modelos (Sincronización BD ↔ Backend)

- **Usuario:** foto_perfil_url (typo corregido)
- **Barbero:** especialidad (campo agregado)
- **Reseña:** id_cliente, id_barbero, id_tienda, puntuacion, fecha_resena (campos corregidos/agregados)

### ✅ Tipos de Datos

- Validación de tipos (string, number, boolean)
- Validación de campos requeridos
- Validación de relaciones (Foreign Keys)

### ✅ Sincronización con BD

- Cada modelo tiene exactamente los campos de su tabla
- No hay propiedades extras que no exisan en BD
- Nombres de columnas coinciden exactamente

---

## 🚨 Si un Test Falla

1. **Leer mensaje de error**
   ```
   Expected: 'Juan'
   Received: undefined
   ```

2. **Ejecutar test específico**
   ```bash
   npx jest usuario.model.test.js --verbose
   ```

3. **Debug:**
   ```bash
   node --inspect-brk node_modules/.bin/jest --runInBand
   # Abre Chrome DevTools en chrome://inspect
   ```

4. **Verificar:**
   - ¿Cambio en el código? → Actualizar test
   - ¿Cambio en BD? → Actualizar modelo + test
   - ¿Error en fixture? → Revisar datos de prueba

---

## 📝 Escribir Nuevo Test

```javascript
// tests/unit/nuevo.model.test.js
const MiModelo = require('../../src/domain/entities/MiModelo')

describe('MiModelo', () => {
  test('debe crear instancia', () => {
    const data = { id: 1 }
    const instancia = new MiModelo(data)
    expect(instancia.id).toBe(1)
  })
})
```

Luego ejecutar:
```bash
npm test
```

---

## 🔗 Referencias

- Documentación: `backend-agent.md` (`testing: Jest`)
- Guía completa: `TESTING_GUIDE.md`
- Jest docs: https://jestjs.io/

---

**Última actualización:** 14 de abril de 2026  
**Próximo paso:** Agregar tests para Cita, Cliente, Servicio
