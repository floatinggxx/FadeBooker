const TiendaRepository = require('../../../infraestructure/database/TiendaRepositoryImpl');
const BarberoRepository = require('../../../infraestructure/database/BarberoRepositoryImpl');
const TiendaService = require('../../../application/usecases/tienda.service');

const tiendaRepository = new TiendaRepository();
const barberoRepository = new BarberoRepository();
const tiendaService = new TiendaService(tiendaRepository, barberoRepository);

const TiendaController = {
  /**
   * GET /api/tiendas
   * Lista todas las tiendas, permite filtrar por ciudad
   */
  async obtenerTodas(req, res) {
    try {
      const { ciudad } = req.query
      const tiendas = await tiendaService.obtenerTodasLasTiendas({ ciudad })
      res.json(tiendas)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  /**
   * GET /api/tiendas/:id/barberos
   * Obtiene todos los barberos de una tienda
   */
  async obtenerBarberos(req, res) {
    try {
      const { id } = req.params
      const barberos = await tiendaService.getBarberosByTienda(id)
      res.json(barberos)
    } catch (error) {
      const statusCode = error.message === 'La tienda no existe' ? 404 : 400;
      res.status(statusCode).json({ error: error.message })
    }
  },

  /**
   * GET /api/tiendas/:id/resenas
   * Obtiene todas las reseñas de una tienda
   */
  async obtenerResenas(req, res) {
    try {
      const { id } = req.params
      const resenas = await tiendaService.getResenas(id)
      res.json(resenas)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  /**
   * GET /api/tiendas/:id
   * Obtiene una tienda por su ID
   */
  async obtenerPorId(req, res) {
    try {
      const { id } = req.params
      const tienda = await tiendaService.obtenerTiendaPorId(id)
      if (!tienda) {
        return res.status(404).json({ error: 'Tienda no encontrada' })
      }
      res.json(tienda)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  /**
   * GET /api/tiendas/ciudad/:ciudad
   * Busca tiendas por ciudad
   */
  async buscarPorCiudad(req, res) {
    try {
      const { ciudad } = req.params
      const tiendas = await tiendaService.buscarTiendasPorCiudad(ciudad)
      res.json(tiendas)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  /**
   * POST /api/tiendas
   * Crea una nueva tienda
   */
  async crear(req, res) {
    try {
      const idTienda = await tiendaService.crearTienda(req.body)
      res.status(201).json({ id_tienda: idTienda, message: 'Tienda creada exitosamente' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  /**
   * PUT /api/tiendas/:id
   * Actualiza una tienda
   */
  async actualizar(req, res) {
    try {
      const { id } = req.params
      const exitoso = await tiendaService.actualizarTienda(id, req.body)
      if (!exitoso) {
        return res.status(404).json({ error: 'Tienda no encontrada o sin cambios' })
      }
      res.json({ message: 'Tienda actualizada exitosamente' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  /**
   * DELETE /api/tiendas/:id
   * Elimina (desactiva) una tienda
   */
  async eliminar(req, res) {
    try {
      const { id } = req.params
      const exitoso = await tiendaService.eliminarTienda(id)
      if (!exitoso) {
        return res.status(404).json({ error: 'Tienda no encontrada' })
      }
      res.json({ message: 'Tienda desactivada exitosamente' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  /**
   * POST /api/tiendas/:id/foto
   * Sube una foto de la tienda a Cloudinary
   */
  async actualizarFoto(req, res) {
    try {
      const { id } = req.params
      const { image } = req.body
      if (!image) {
        return res.status(400).json({ status: 'error', message: 'La imagen es requerida' })
      }
      const result = await tiendaService.actualizarFoto(id, image)
      return res.json(result)
    } catch (error) {
      console.error('Error al actualizar foto de tienda:', error)
      return res.status(400).json({ status: 'error', message: error.message })
    }
  },

  /**
   * POST /api/tiendas/:id/galeria
   * Sube una foto a la galería de la tienda
   */
  async actualizarGaleria(req, res) {
    try {
      const { id } = req.params
      const { image } = req.body
      if (!image) {
        return res.status(400).json({ status: 'error', message: 'La imagen es requerida' })
      }
      const result = await tiendaService.actualizarGaleria(id, image)
      return res.json(result)
    } catch (error) {
      console.error('Error al actualizar galería de tienda:', error)
      return res.status(400).json({ status: 'error', message: error.message })
    }
  }
}

module.exports = TiendaController
