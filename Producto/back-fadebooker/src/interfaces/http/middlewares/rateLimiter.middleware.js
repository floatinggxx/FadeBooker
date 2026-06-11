// Simple in-memory rate limiter por IP y por phone (suficiente para MVP/pruebas)
const rateMap = new Map();

function rateLimiter({ windowMs = 5 * 60 * 1000, max = 5, keyPrefix = 'ip' } = {}) {
  return (req, res, next) => {
    try {
      const key = keyPrefix === 'phone' ? (req.body && req.body.phone) || 'unknown_phone' : req.ip || req.connection.remoteAddress || 'unknown_ip';
      const now = Date.now();
      const entry = rateMap.get(key) || { count: 0, first: now };

      if (now - entry.first > windowMs) {
        entry.count = 1;
        entry.first = now;
      } else {
        entry.count++;
      }

      rateMap.set(key, entry);

      if (entry.count > max) {
        return res.status(429).json({ status: 'error', message: 'Too many requests. Try later.' });
      }

      next();
    } catch (err) {
      next();
    }
  };
}

module.exports = rateLimiter;
