/**
 * Modelo de Dominio: PhoneVerification
 * Representa un intento de verificación de teléfono con PIN temporal
 */

class PhoneVerification {
  constructor({
    id,
    user_id,
    phone,
    pin_hash,
    via_channel,
    attempts,
    max_attempts,
    verified_at,
    expires_at,
    telegram_id,
    created_at,
    updated_at
  }) {
    this.id = id;
    this.user_id = user_id;
    this.phone = phone;
    this.pin_hash = pin_hash;  // Hash bcrypt del PIN
    this.via_channel = via_channel;  // 'telegram' | 'sms'
    this.attempts = attempts || 0;
    this.max_attempts = max_attempts || 3;
    this.verified_at = verified_at;  // NULL hasta que se verifique
    this.expires_at = expires_at;
    this.telegram_id = telegram_id;  // Capturado desde webhook
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  /**
   * Verifica si el registro ha expirado
   */
  isExpired() {
    return new Date() > new Date(this.expires_at);
  }

  /**
   * Verifica si se han agotado los intentos
   */
  isMaxAttemptsExceeded() {
    return this.attempts >= this.max_attempts;
  }

  /**
   * Verifica si ya fue verificado
   */
  isVerified() {
    return this.verified_at !== null;
  }

  /**
   * Verifica si el registro es válido (no expirado, no verificado, intentos disponibles)
   */
  isValid() {
    return !this.isExpired() && !this.isVerified() && !this.isMaxAttemptsExceeded();
  }
}

module.exports = PhoneVerification;
