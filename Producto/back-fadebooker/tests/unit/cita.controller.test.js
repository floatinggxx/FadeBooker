/**
 * Tests Unitarios - Cita Controller
 */

// Mock de base de datos ANTES de importar el controlador
jest.mock('../../src/db/knex', () => ({
  where: jest.fn().mockReturnThis(),
  update: jest.fn().mockResolvedValue(1),
  select: jest.fn().mockReturnThis(),
  first: jest.fn().mockResolvedValue({}),
  leftJoin: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  insert: jest.fn().mockResolvedValue([1]),
}));

const CitaController = require('../../src/interfaces/http/controllers/cita.controller');

describe('CitaController', () => {
  let citaController;
  let mockCitaService;
  let req, res, next;

  beforeEach(() => {
    mockCitaService = {
      agendarCita: jest.fn(),
      getCitaById: jest.fn(),
      cancelarCita: jest.fn(),
      crearResena: jest.fn(),
      obtenerCitasPorCliente: jest.fn(),
      obtenerCitasPorBarbero: jest.fn(),
      obtenerCitasPorTienda: jest.fn()
    };
    citaController = new CitaController(mockCitaService);
    
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('crearResena', () => {
    test('debe retornar 201 al crear reseña con éxito', async () => {
      req.params.id = '1';
      req.body = { puntuacion: 5, comentario: 'Excelente' };
      mockCitaService.crearResena.mockResolvedValue(100);

      await citaController.crearResena(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 100 }));
    });

    test('debe retornar 400 si falla', async () => {
      req.params.id = '1';
      req.body = { puntuacion: 5, comentario: 'Excelente' };
      const error = new Error('Service Error');
      mockCitaService.crearResena.mockRejectedValue(error);

      await citaController.crearResena(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Service Error' });
    });
  });

  describe('listar', () => {
    test('debe filtrar por el usuario autenticado cuando el token usa id_usuario', async () => {
      req.query = {};
      req.user = { id_usuario: 42, rol: 'Cliente' };
      mockCitaService.obtenerCitasPorCliente.mockResolvedValue([{ id_cita: 10 }]);

      await citaController.listar(req, res, next);

      expect(mockCitaService.obtenerCitasPorCliente).toHaveBeenCalledWith(42);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id_cita: 10 }]);
    });
  });
});
