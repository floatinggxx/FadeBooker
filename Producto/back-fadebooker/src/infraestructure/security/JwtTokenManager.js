const jwt = require('jsonwebtoken');

class JwtTokenManager {
  constructor() {
    this.secret = process.env.JWT_SECRET || 'secret_key_temporal';
    this.expiresIn = '24h'; // Expiración estricta de 24h según Ley del Proyecto
  }

  sign(payload) {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verify(token) {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      return null;
    }
  }
}

module.exports = JwtTokenManager;
