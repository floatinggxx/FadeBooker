/**
 * TiendaService
 * Lógica de negocio para la gestión de tiendas
 */
class TiendaService {
  constructor(tiendaRepository, barberoRepository) {
    this.tiendaRepository = tiendaRepository;
    this.barberoRepository = barberoRepository;
  }

  async obtenerTodasLasTiendas(filtros = {}) {
    // Obtener todas las tiendas y filtrar las que no tengan datos mínimos o sin barberos activos
    const todas = await this.tiendaRepository.findAll(filtros)
    const resultado = []
    for (const t of todas) {
      // Verificar campos obligatorios: comuna, region, dias_laborales
      const tieneDatosBasicos = t.comuna && t.region && t.dias_laborales;
      if (!tieneDatosBasicos) continue;
      // Verificar que exista al menos un barbero activo y con servicios disponibles
      const barberos = await this.barberoRepository.findByTienda(t.id_tienda)
      if (!barberos || (Array.isArray(barberos) && barberos.length === 0)) continue;
      resultado.push(t)
    }
    return resultado
  }

  async obtenerTiendaPorId(id) {
    return await this.tiendaRepository.findById(id)
  }

  async getBarberosByTienda(id_tienda) {
    // Verificar si la tienda existe
    const tienda = await this.tiendaRepository.findById(id_tienda)
    if (!tienda) {
      throw new Error('La tienda no existe')
    }

    // Asegurar que el dueño de la tienda también esté registrado como barbero
    if (tienda.id_dueño) {
      try {
        const ownerBarbero = await this.barberoRepository.findByUsuarioId(tienda.id_dueño)
        if (!ownerBarbero) {
          await this.barberoRepository.create({
            id_usuario: tienda.id_dueño,
            id_tienda: id_tienda,
            especialidad: 'Dueño de Tienda',
            activo: 1,
            tarifa_base: 0
          })
        } else if (!ownerBarbero.id_tienda || Number(ownerBarbero.id_tienda) !== Number(id_tienda)) {
          await this.barberoRepository.update(ownerBarbero.id_barbero, { id_tienda: id_tienda })
        }
      } catch (err) {
        console.error('[TiendaService] Error asegurando barbero dueño disponible:', err)
      }
    }

    return await this.barberoRepository.findByTienda(id_tienda)
  }

  async buscarTiendasPorComuna(comuna) {
    return await this.tiendaRepository.findByComuna(comuna)
  }

  async buscarTiendasPorRegion(region) {
    return await this.tiendaRepository.findByRegion(region)
  }

  async getResenas(id_tienda) {
    return await this.tiendaRepository.getResenas(id_tienda)
  }

  async crearTienda(data) {
    // Crear la tienda
    const id = await this.tiendaRepository.create(data)
    // Si el payload incluye id_dueño (owner) y el usuario existe, asegurar que exista un barbero asociado
    try {
      const ownerId = data.id_dueño || data.id_dueno || data.id_dueno_tienda || null
      if (ownerId) {
        // Verificar si ya es barbero
        const existingBarbero = await this.barberoRepository.findByUsuarioId(ownerId)
        if (!existingBarbero) {
          // Crear un barbero mínimo vinculado a la tienda
          await this.barberoRepository.create({
            id_usuario: ownerId,
            id_tienda: id,
            especialidad: 'Jefe de Tienda',
            activo: 1
          })
        } else {
          // si existe barbero, asegurar que esté ligado a esta tienda
          if (!existingBarbero.id_tienda) {
            await this.barberoRepository.update(existingBarbero.id_barbero, { id_tienda: id })
          }
        }
      }
    } catch (err) {
      // No queremos que la creación de barbero bloquee la creación de la tienda; solo loguear
      console.error('[TiendaService] Error asegurando barbero dueño:', err)
    }
    return id
  }

  async actualizarTienda(id, data) {
    return await this.tiendaRepository.update(id, data)
  }

  async eliminarTienda(id) {
    return await this.tiendaRepository.delete(id)
  }

  async actualizarFoto(id, base64Image) {
    const CloudinaryService = require('../../infraestructure/storage/CloudinaryService');
    try {
      const result = await CloudinaryService.uploadImage(base64Image, 'fadebooker/tiendas');
      // Fix: Usar el nombre de columna correcto en la base de datos (foto_portada_url)
      await this.tiendaRepository.update(id, { foto_portada_url: result.secure_url });
      return { fotoUrl: result.secure_url };
    } catch (error) {
      console.error('--- ERROR EN TIENDA SERVICE (UPLOAD FOTO) ---');
      console.error(error);
      throw new Error(`Error al procesar la imagen de la tienda: ${error.message}`);
    }
  }

  async actualizarGaleria(id, base64Image) {
    const CloudinaryService = require('../../infraestructure/storage/CloudinaryService');
    try {
      const result = await CloudinaryService.uploadImage(base64Image, 'fadebooker/galeria');
      const tienda = await this.tiendaRepository.findById(id);
      let galeria = [];
      if (tienda.galeria) {
        try {
          galeria = typeof tienda.galeria === 'string' ? JSON.parse(tienda.galeria) : tienda.galeria;
        } catch (e) {
          galeria = [];
        }
      }
      if (!Array.isArray(galeria)) galeria = [];
      galeria.push(result.secure_url);
      await this.tiendaRepository.update(id, { galeria: JSON.stringify(galeria) });
      return { fotoUrl: result.secure_url };
    } catch (error) {
      console.error('--- ERROR EN TIENDA SERVICE (UPLOAD GALERIA) ---');
      console.error(error);
      throw new Error(`Error al procesar la imagen de la galería: ${error.message}`);
    }
  }
}

module.exports = TiendaService
