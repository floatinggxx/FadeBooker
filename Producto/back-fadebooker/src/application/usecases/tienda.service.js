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
    return await this.tiendaRepository.findAll(filtros)
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
    return await this.barberoRepository.findByTienda(id_tienda)
  }

  async buscarTiendasPorCiudad(ciudad) {
    return await this.tiendaRepository.findByCiudad(ciudad)
  }

  async getResenas(id_tienda) {
    return await this.tiendaRepository.getResenas(id_tienda)
  }

  async crearTienda(data) {
    return await this.tiendaRepository.create(data)
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
