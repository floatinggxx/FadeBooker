# 🔍 Auditoría de Sincronización BD ↔ Backend

**Fecha:** 14 de abril de 2026  
**Estado:** ❌ DESINCRONIZACIONES ENCONTRADAS  
**Total Errores:** 7 críticos

---

## 📋 Resumen de Desincronizaciones

| Archivo | Línea | Tipo | Severidad | Status |
|---------|-------|------|-----------|--------|
| usuario.model.js | 9 | Typo en propiedad | 🔴 CRÍTICA | ⏳ Pendiente |
| barbero.model.js | 5 | Campo faltante | 🔴 CRÍTICA | ⏳ Pendiente |
| resena.model.js | 2-9 | 5 campos incorrectos | 🔴 CRÍTICA | ⏳ Pendiente |
| BarberoRepositoryImpl.js | 17 | Nombre columna incorrecto | 🟠 ALTA | ⏳ Pendiente |
| cliente.model.js | 4 | Campo no existe en BD | 🟠 ALTA | ⏳ Pendiente |

---

## 🚨 Detalle de Errores

### 1. ❌ usuario.model.js - Typo en propiedad

**Ubicación:** Línea 9  
**Severidad:** 🔴 CRÍTICA  
**Problema:**
```javascript
// ❌ INCORRECTO
this.foto_profil_url = foto_profil_url  // typo: "profil" en lugar de "perfil"

// ✅ CORRECTO
this.foto_perfil_url = foto_perfil_url
```

**Impacto:** 
- Foto de perfil del usuario siempre será `undefined`
- Avatar no se muestra en la aplicación
- Duplicación de propiedades

**BD Schema:**
- `Usuario.foto_perfil_url` (nvarchar) ✅ existe
- Parámetro constructor: `foto_perfil_url` ✓ correcto
- Asignación: `foto_profil_url` ✗ incorrecto (typo)

**Solución:** Cambiar `foto_profil_url` por `foto_perfil_url`

---

### 2. ❌ barbero.model.js - Campo faltante

**Ubicación:** Línea 5  
**Severidad:** 🔴 CRÍTICA  
**Problema:**
```javascript
// ❌ FALTA "especialidad" en el constructor
constructor({ 
  id_usuario, ..., id_tienda, 
  // ❌ AQUI FALTA "especialidad" 
  anos_experiencia, ... 
}) 

// ✅ CORRECTO: debe incluir
const especialidad = especialidad;  // de la BD
```

**Impacto:**
- Barbero sin especialidad
- Búsqueda por especialidad no funciona
- Filtrado de servicios no es posible

**BD Schema:**
```
Barbero: [..., especialidad(nvarchar), anos_experiencia, ...]
```

**Solución:** Agregar `especialidad` al constructor y asignar con `this.especialidad = especialidad`

---

### 3. ❌ resena.model.js - 5 campos desincronizados

**Ubicación:** Línea 2-9  
**Severidad:** 🔴 CRÍTICA  
**Problema:**

**BD Schema (Correcto):**
```sql
Reseña: [
  id_resena(int),
  id_cita(int),
  id_cliente(int),        ✅ DEBE ESTAR
  id_barbero(int),        ✅ DEBE ESTAR
  id_tienda(int),         ✅ DEBE ESTAR
  puntuacion(int),        ✅ DEBE ESTAR
  comentario(nvarchar),
  fecha_resena(datetime2), ✅ DEBE ESTAR
  createdAt(datetime2)
]
```

**Código Actual (Incorrecto):**
```javascript
constructor({ 
  id_resena, 
  id_cita, 
  id_usuario,              ❌ INCORRECTO (debería ser id_cliente)
  calificacion,            ❌ INCORRECTO (debería ser puntuacion)
  comentario, 
  createdAt 
  // ❌ FALTAN: id_barbero, id_tienda, puntuacion, fecha_resena
})
```

**Mapeo Correcto:**
| Actual | Debe ser | Tipo |
|--------|----------|------|
| `id_usuario` | `id_cliente` | Cambiar |
| `calificacion` | `puntuacion` | Cambiar |
| ❌ falta | `id_barbero` | Agregar |
| ❌ falta | `id_tienda` | Agregar |
| ❌ falta | `fecha_resena` | Agregar |

**Impacto:**
- Reseñas sin relación a barbero
- No se pueden filtrar reseñas por tienda
- Campo puntuación rompe toda la lógica
- Auditoría de cambios incompleta

**Solución:** Reescribir modelo completamente

---

### 4. ❌ BarberoRepositoryImpl.js - Nombre columna incorrecto

**Ubicación:** Línea 17  
**Severidad:** 🟠 ALTA  
**Problema:**
```javascript
// ❌ INCORRECTO
async actualizarHorario(id_barbero, horario) {
  return db('Barbero')
    .where({ id_barbero })
    .update({ 
      actualizado_at: db.raw('GETDATE()')  // ❌ columna no existe
    })
}

// ✅ CORRECTO
.update({ 
  updatedAt: db.raw('GETDATE()')  // ✅ nombre correcto en BD
})
```

**Impacto:**
- Error en query: "Invalid column name 'actualizado_at'"
- Método `actualizarHorario` falla completamente
- updatedAt nunca se actualiza en BD

**BD Schema:**
```
Barbero: [..., updatedAt(datetime2)]  ✅ columna correcta
```

**Solución:** Cambiar `actualizado_at` por `updatedAt`

---

### 5. ⚠️ cliente.model.js - Campo fantasma

**Ubicación:** Línea 4  
**Severidad:** 🟠 ALTA  
**Problema:**
```javascript
// ⚠️ CAMPO QUE NO EXISTE EN BD
class Cliente extends Usuario {
  constructor({ 
    ..., 
    puntos_acumulados     // ⚠️ NO EXISTE en tabla Usuario
  }) {
    super(...)
    this.puntos_acumulados = puntos_acumulados || 0
  }
}
```

**Impacto:**
- Campo fantasma no sincronizado con BD
- Datos siempre vienen como `null` o `undefined` de BD
- Valor por defecto `0` es hardcoded

**BD Schema:**
```
Usuario: [id_usuario, email, nombre, ..., updatedAt]
❌ NO TIENE puntos_acumulados
```

**Opciones de Solución:**
A) Si es un campo calculado: mover a repositorio como método específico
B) Si debe ser persistente: agregarlo a tabla Usuario en BD
C) Si es temporal: no guardarlo en modelo

**Recomendación:** Crear campos de negocio en repositorio, no en modelos entidad

---

## 📊 Matriz de Sincronización

### Por Tabla BD

#### Usuario (12 campos)
| Campo BD | Model | Repo | Status |
|----------|-------|------|--------|
| id_usuario | ✅ | ✅ | OK |
| email | ✅ | ✅ | OK |
| nombre | ✅ | ✅ | OK |
| apellido | ✅ | ✅ | OK |
| telefono | ✅ | ✅ | OK |
| rol | ✅ | ✅ | OK |
| estado | ✅ | ✅ | OK |
| foto_perfil_url | ❌ | ✅ | **TYPO en modelo** |
| fecha_registro | ✅ | ✅ | OK |
| ultimo_login | ✅ | ✅ | OK |
| createdAt | ✅ | ✅ | OK |
| updatedAt | ✅ | ✅ | OK |

#### Barbero (12 campos)
| Campo BD | Model | Repo | Status |
|----------|-------|------|--------|
| id_barbero | ✅ | ✅ | OK |
| id_usuario | ✅ | ✅ | OK |
| id_tienda | ✅ | ✅ | OK |
| especialidad | ❌ | ✅ | **FALTA en modelo** |
| anos_experiencia | ✅ | ✅ | OK |
| tarifa_base | ✅ | ✅ | OK |
| foto_perfil_url | ✅ | ✅ | OK |
| calificacion_promedio | ✅ | ✅ | OK |
| total_resenas | ✅ | ✅ | OK |
| activo | ✅ | ✅ | OK |
| createdAt | ✅ | ✅ | OK |
| updatedAt | ✅ | ❌ | **NOMBRE INCORRECTO en repo** |

#### Reseña (9 campos)
| Campo BD | Model | Repo | Status |
|----------|-------|------|--------|
| id_resena | ✅ | ✅ | OK |
| id_cita | ✅ | ✅ | OK |
| id_cliente | ❌ | - | **INCORRECTO en modelo** |
| id_barbero | ❌ | - | **FALTA en modelo** |
| id_tienda | ❌ | - | **FALTA en modelo** |
| puntuacion | ❌ | - | **INCORRECTO en modelo** |
| comentario | ✅ | ✅ | OK |
| fecha_resena | ❌ | - | **FALTA en modelo** |
| createdAt | ✅ | ✅ | OK |

#### Cliente (Usuario + Custom)
| Campo | Model | Status |
|-------|-------|--------|
| puntos_acumulados | ⚠️ | **NO EXISTE en BD** |

---

## 🔧 Plan de Corrección

### SPRINT 1 - Críticos (Hacer YA)
- [ ] usuario.model.js: Cambiar `foto_profil_url` → `foto_perfil_url`
- [ ] barbero.model.js: Agregar parámetro `especialidad`
- [ ] resena.model.js: Reescribir modelo completamente (5 cambios)
- [ ] BarberoRepositoryImpl.js: Cambiar `actualizado_at` → `updatedAt`

### SPRINT 2 - Design (Revisar)
- [ ] cliente.model.js: Decidir si `puntos_acumulados` es campos BD o lógica

---

## 📝 Recomendaciones

1. **Validación automática:** Crear script para auditar sincronización mensual
2. **Tipado:** Usar TypeScript para evitar typos como `foto_profil_url`
3. **ORM:** Considerar usar TypeORM o Sequelize para auto-mapeo de columnas
4. **Tests:** Agregar tests que validen correspondencia modelo ↔ BD

---

**Última actualización:** 14 de abril de 2026  
**Próxima acción:** Ejecutar correcciones automáticas
