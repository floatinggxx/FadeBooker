-- Migración: Actualizar hashes de contraseñas de usuarios
-- Fecha: 14 de mayo de 2026
-- Descripción: Actualiza la columna contrasena con hashes Bcrypt (10 rounds) para los usuarios iniciales.

BEGIN TRANSACTION;

-- Usuario vday3627 (ID 7)
UPDATE dbo.Usuario SET contrasena = '$2b$10$1QJ5ETKven4e5WSEHhthK.bTRpcwLlfjYCLGRL0cRK/.og0RpZAlC' WHERE id_usuario = 7;

-- Usuario barber_1_pass (ID 1)
UPDATE dbo.Usuario SET contrasena = '$2b$10$n0FpqsjaQNjNq/Q/oDl7KeTXMwF.sQOm0AiSQNEZc6n8iFcVaKOLy' WHERE id_usuario = 1;

-- Usuario barber_2_pass (ID 2)
UPDATE dbo.Usuario SET contrasena = '$2b$10$1XVX8GZnig4oOqVhCwPhMe3F6BqlshGE/iICKmQP/p4PzHTYyHE0q' WHERE id_usuario = 2;

-- Usuario client_1_pass (ID 3)
UPDATE dbo.Usuario SET contrasena = '$2b$10$rAI0IeErgctCV7oj.HcM4.UiZqBXAvuyERqtasEah8qfx3MDDA3yq' WHERE id_usuario = 3;

-- Usuario client_2_pass (ID 4)
UPDATE dbo.Usuario SET contrasena = '$2b$10$k7jQ..R65lS9foCM21A8peZn0.mHUiLJya4I3FSZu2OVnBFLNQvci' WHERE id_usuario = 4;

-- Usuario admin_pass (ID 5)
UPDATE dbo.Usuario SET contrasena = '$2b$10$5XVOioQW4nVHYh7CE0thNeI9MmhgtoQwRNNxRWsdUq1QBhxPVNsFK' WHERE id_usuario = 5;

-- Usuario test_user_pass (ID 6)
UPDATE dbo.Usuario SET contrasena = '$2b$10$XYidFWMkZjtIKh.nQpWyI.VTSgeZ8uDhECKxJXDpRThkTA1ASJ8P2' WHERE id_usuario = 6;

COMMIT;