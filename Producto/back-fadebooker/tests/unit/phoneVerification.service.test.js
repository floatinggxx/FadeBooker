const PhoneVerificationRepositoryImpl = require('../../src/infraestructure/database/PhoneVerificationRepositoryImpl');
const NotificationLogRepositoryImpl = require('../../src/infraestructure/database/NotificationLogRepositoryImpl');
const UsuarioRepositoryImpl = require('../../src/infraestructure/database/UsuarioRepositoryImpl');
const PhoneVerificationService = require('../../src/application/usecases/phoneVerification.service');

jest.mock('../../src/infraestructure/notifications/telegram');
const telegram = require('../../src/infraestructure/notifications/telegram');

describe('PhoneVerificationService', () => {
  let service;
  beforeEach(() => {
    const phoneRepo = new PhoneVerificationRepositoryImpl();
    const usuarioRepo = new UsuarioRepositoryImpl();
    const logRepo = new NotificationLogRepositoryImpl();

    // mock methods used
    jest.spyOn(usuarioRepo, 'findById').mockResolvedValue({ id_usuario: 1, telefono: '3001234', telegram_id: null });
    jest.spyOn(phoneRepo, 'create').mockResolvedValue(1);
    jest.spyOn(logRepo, 'logNotification').mockResolvedValue(1);

    service = new PhoneVerificationService(phoneRepo, usuarioRepo, logRepo, require('../../src/infraestructure/notifications/TelegramService'));
  });

  test('initiateVerification returns skipped when no telegram_id', async () => {
    const result = await service.initiateVerification({ userId: 1, phone: '3001234', via: 'telegram' });
    expect(result.status).toBe('skipped');
  });
});
