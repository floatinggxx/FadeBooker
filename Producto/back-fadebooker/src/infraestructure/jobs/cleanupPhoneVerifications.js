const PhoneVerificationRepository = require('../database/PhoneVerificationRepositoryImpl');

async function cleanupExpired() {
  const repo = new PhoneVerificationRepository();
  try {
    const deleted = await repo.deleteExpired();
    console.log(`[cleanup] Deleted expired phone verifications: ${deleted}`);
  } catch (err) {
    console.error('[cleanup] Error deleting expired verifications', err.message);
  }
}

module.exports = { cleanupExpired };
