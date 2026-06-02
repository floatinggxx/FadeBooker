/**
 * Tests Unitarios - Resena Repository
 */

// Mock Knex
const mKnex = jest.fn(() => mKnex);
mKnex.insert = jest.fn().mockReturnThis();
mKnex.returning = jest.fn().mockReturnThis();
mKnex.where = jest.fn().mockReturnThis();
mKnex.first = jest.fn().mockReturnThis();
mKnex.select = jest.fn().mockReturnThis();
mKnex.orderBy = jest.fn().mockReturnThis();
mKnex.avg = jest.fn().mockReturnThis();
mKnex.join = jest.fn().mockReturnThis();
mKnex.raw = jest.fn().mockResolvedValue([]);

// Implementación de promise para el await
mKnex.then = jest.fn(function(onFulfilled) {
  return Promise.resolve(this._results || []).then(onFulfilled);
});

jest.mock('../../src/db/knex', () => mKnex);

const db = require('../../src/db/knex');
const resenaRepo = require('../../src/infraestructure/database/ResenaRepositoryImpl');


describe('ResenaRepositoryImpl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete db._results;
  });

  describe('create', () => {
    test('debe insertar correctamente una reseña', async () => {
      const data = { id_cita: 1, puntuacion: 5 };
      db.raw.mockResolvedValue([{ id_resena: 100 }]);

      const result = await resenaRepo.create(data);

      expect(db.raw).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO [dbo].[Reseña]'),
        expect.any(Array)
      );
      expect(result).toBe(100);
    });
  });

  describe('getByCitaId', () => {
    test('debe obtener reseña por ID de cita', async () => {
      db._results = { id_resena: 1 };

      const result = await resenaRepo.getByCitaId(1);

      expect(db).toHaveBeenCalledWith('Reseña');
      expect(db.where).toHaveBeenCalledWith({ id_cita: 1 });
      expect(result).toEqual({ id_resena: 1 });
    });
  });
});


