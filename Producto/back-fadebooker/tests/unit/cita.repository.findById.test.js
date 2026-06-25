jest.mock('../../src/db/knex', () => {
  const mockQuery = {
    where: jest.fn().mockReturnThis(),
    first: jest.fn()
  };

  const mockDb = jest.fn(() => mockQuery);
  mockDb.__mockQuery = mockQuery;

  return mockDb;
});

const CitaRepositoryImpl = require('../../src/infraestructure/database/CitaRepositoryImpl');
const knex = require('../../src/db/knex');

describe('CitaRepositoryImpl.findByIdForPayment', () => {
  beforeEach(() => {
    knex.__mockQuery.where.mockReset();
    knex.__mockQuery.first.mockReset();
    knex.__mockQuery.where.mockReturnThis();
  });

  test('debe devolver la cita por id sin filtrar por soft-delete', async () => {
    const expected = { id_cita: 106, estado: 'pendiente', notas: '[soft-delete]' };
    knex.__mockQuery.first.mockResolvedValue(expected);

    const repo = new CitaRepositoryImpl();
    const result = await repo.findByIdForPayment(106);

    expect(result).toEqual(expected);
    expect(knex).toHaveBeenCalledWith('Cita');
    expect(knex.__mockQuery.where).toHaveBeenCalledWith({ id_cita: 106 });
  });
});
