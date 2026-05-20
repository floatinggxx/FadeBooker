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
}

module.exports = TiendaService
