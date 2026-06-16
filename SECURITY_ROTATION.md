# SECURITY ROTATION LOG

Fecha: 2026-06-15

Resumen: Se rotaron las credenciales que pudieron haber quedado expuestas cuando el repositorio fue público temporalmente. A continuación se detalla qué se rotó y las acciones realizadas.

1) SMTP (Gmail) — `FadeBooker_new`
  - Acción: Revocada la App Password previa y creada una nueva App Password.
  - Variable actualizada: `EMAIL_PASS` en Azure App Service (fadebooker-backend-v2) y en `.env` local.
  - Nota: NO guardar la contraseña en el repositorio.

2) Mercado Pago — entorno TEST
  - Acción: Regenerado (rotado) el Access Token de prueba en Mercado Pago (Credentials → Test Credentials → regenerate/new token).
  - Variable actualizada: `MP_ACCESS_TOKEN` en Azure App Service y en `.env` local.

3) Archivos y código modificados
  - Reemplazados valores hardcodeados o temporales por `process.env`/placeholders en:
    - `generate_token.js` — ahora usa `process.env.JWT_SECRET`.
    - `test_bloquehorario_post.js` — ahora usa `process.env.JWT_SECRET` para generar token de prueba.
    - `update_main_swagger.js` — ejemplos de contraseñas reemplazados por `<REPLACE_WITH_SECURE_PASSWORD>`.
    - `Producto/front-fadebooker/src/features/barberos/ui/BarberosManager.tsx` — eliminado password hardcodeado del form.

4) Variables verificadas en Azure App Service
  - `EMAIL_HOST`, `EMAIL_PASS`, `EMAIL_USER`, `EMAIL_PORT`, `MP_ACCESS_TOKEN` se actualizaron en la configuración de la App Service `fadebooker-backend-v2`.

5) Acciones pendientes (recomendadas)
  - Ejecutar limpieza del historial Git para eliminar las apariciones pasadas de las credenciales.
  - Forzar push al repositorio remoto (avisar al equipo y coordinar re-clonados o rebase local).
  - Añadir escaneo de secretos en CI y pre-commit hooks.

Contacto: mauricio (owner) — confirmar que las pruebas (email, pagos) funcionan en staging/producción.
