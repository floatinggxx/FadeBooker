/**
 * Generador seguro de PIN aleatorio
 * Utilidad para crear PINs de verificación
 */

const crypto = require('crypto');

class PinGenerator {
  /**
   * Genera un PIN aleatorio de N dígitos
   * @param {number} length - Longitud del PIN (default: 6)
   * @returns {string} PIN de dígitos
   */
  static generate(length = 6) {
    if (length < 4 || length > 12) {
      throw new Error('PIN length debe estar entre 4 y 12 dígitos');
    }

    const pin = crypto
      .randomInt(0, Math.pow(10, length))
      .toString()
      .padStart(length, '0');

    return pin;
  }

  /**
   * Genera un token alfanumérico seguro
   * Útil para links de verificación
   * @param {number} length - Longitud del token (default: 32)
   * @returns {string} Token hexadecimal
   */
  static generateToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Valida formato de PIN (solo dígitos)
   * @param {string} pin - PIN a validar
   * @param {number} length - Longitud esperada (default: 6)
   * @returns {boolean}
   */
  static isValidFormat(pin, length = 6) {
    const regex = new RegExp(`^\\d{${length}}$`);
    return regex.test(pin);
  }
}

module.exports = PinGenerator;
