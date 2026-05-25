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
      await this.tiendaRepository.update(id, { fotoUrl: result.secure_url });
      return { fotoUrl: result.secure_url };
    } catch (error) {
      console.error('--- ERROR EN TIENDA SERVICE (UPLOAD FOTO) ---');
      console.error(error);
      throw new Error(`Error al procesar la imagen de la tienda: ${error.message}`);
    }
  }
}

module.exports = TiendaService
