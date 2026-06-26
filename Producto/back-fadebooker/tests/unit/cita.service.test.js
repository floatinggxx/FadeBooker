/**
 * Tests Unitarios - Cita Service (Reseñas)
 * Valida la lógica de negocio para la creación de reseñas
 */

// Mock del repositorio de reseñas (Singleton)
jest.mock('../../src/infraestructure/database/ResenaRepositoryImpl', () => ({
  create: jest.fn(),
  getByCitaId: jest.fn(),
  getByTiendaId: jest.fn()
}));

const resenaRepo = require('../../src/infraestructure/database/ResenaRepositoryImpl');
const CitaService = require('../../src/application/usecases/cita.service');

describe('CitaService (Reseñas)', () => {
  let citaService;
  let mockCitaRepo;
  let mockServicioRepo;
  let mockUsuarioRepo;
  let mockBarberoRepo;

  beforeEach(() => {
    jest.clearAllMocks();

    mockCitaRepo = {
      findById: jest.fn(),
      validarServicioBarbero: jest.fn(),
      verificarDisponibilidad: jest.fn(),
      create: jest.fn(),
      update: jest.fn()
    };
    mockServicioRepo = { findById: jest.fn() };
    mockUsuarioRepo = { findById: jest.fn(), findByEmail: jest.fn(), create: jest.fn(), update: jest.fn() };
    mockBarberoRepo = { findById: jest.fn() };
    
    citaService = new CitaService(mockCitaRepo, mockServicioRepo, mockUsuarioRepo, mockBarberoRepo);
  });

  describe('crearResena', () => {
    const citaId = 1;
    const resenaData = { puntuacion: 4.5, comentario: 'Muy bueno' };

    test('debe crear una reseña exitosamente para una cita completada', async () => {
      const mockCita = {
        id_cita: citaId,
        estado: 'completada',
        id_cliente: 10,
        id_barbero: 5,
        id_tienda: 2
      };

      mockCitaRepo.findById.mockResolvedValue(mockCita);
      resenaRepo.getByCitaId.mockResolvedValue(null);
      resenaRepo.create.mockResolvedValue(100);

      const result = await citaService.crearResena(citaId, resenaData);

      expect(resenaRepo.create).toHaveBeenCalledWith(expect.objectContaining({
        id_cita: citaId,
        puntuacion: 4.5,
        id_cliente: 10
      }));
      expect(result).toBe(100);
    });

    test('debe fallar si la cita no está completada', async () => {
      mockCitaRepo.findById.mockResolvedValue({ id_cita: 1, estado: 'pendiente' });

      await expect(citaService.crearResena(citaId, resenaData))
        .rejects.toThrow('Solo se pueden dejar reseñas en citas completadas');
    });

    test('debe fallar si ya existe una reseña para la cita', async () => {
      mockCitaRepo.findById.mockResolvedValue({ id_cita: 1, estado: 'completada' });
      resenaRepo.getByCitaId.mockResolvedValue({ id_resena: 50 });

      await expect(citaService.crearResena(citaId, resenaData))
        .rejects.toThrow('Ya has dejado una reseña para esta cita');
    });
  });

  describe('crearCita', () => {
    test('debe fallar si el barbero está inactivo', async () => {
      mockBarberoRepo.findById.mockResolvedValue({ id_barbero: 1, activo: 0 });

      await expect(citaService.crearCita({
        id_barbero: 1,
        id_servicio: 10,
        id_cliente: 100,
        fecha_hora_inicio: '2025-01-01T10:00:00',
        duracion_minutos: 60,
        monto_total: 15000,
        estado: 'pendiente'
      })).rejects.toThrow('El barbero está inactivo y no puede recibir reservas');

      expect(mockCitaRepo.validarServicioBarbero).not.toHaveBeenCalled();
    });

    test('verificarDisponibilidad devuelve falso si el barbero está inactivo', async () => {
      mockBarberoRepo.findById.mockResolvedValue({ id_barbero: 1, activo: 0 });

      const disponible = await citaService.verificarDisponibilidad(1, '2025-01-01', '10:00:00', 60);
      expect(disponible).toBe(false);
      expect(mockCitaRepo.verificarDisponibilidad).not.toHaveBeenCalled();
    });
  });

  describe('actualizarEstado (Puntos de Fidelizacion)', () => {
    test('debe otorgar 50 puntos al completar una cita', async () => {
      mockCitaRepo.findById.mockResolvedValue({ 
        id_cita: 1, 
        id_cliente: 10, 
        monto_total: 1000, 
        fecha_hora_inicio: '2020-01-01' // En el pasado
      });
      mockUsuarioRepo.findById.mockResolvedValue({ id_usuario: 10, puntos_acumulados: 100 });
      mockUsuarioRepo.update.mockResolvedValue(1);

      await citaService.actualizarEstado(1, 'completada');

      // 50 puntos por cita completada. 100 + 50 = 150.
      expect(mockUsuarioRepo.update).toHaveBeenCalledWith(10, { puntos_acumulados: 150 });
    });
  });
});
