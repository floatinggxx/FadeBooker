const NotificationPreferenceRepository = require('../../../infraestructure/database/NotificationPreferenceRepositoryImpl');
const NotificationPreferenceService = require('../../../application/usecases/notificationPreference.service');

const repo = new NotificationPreferenceRepository();
const service = new NotificationPreferenceService(repo);

const NotificationPreferenceController = {
  async getPreferences(req, res) {
    try {
      const userId = req.user && req.user.id;
      const prefs = await service.getPreferences(userId);
      return res.json({ status: 'success', data: prefs ? prefs.getSummary() : null });
    } catch (err) {
      console.error('[getPreferences] Error:', err);
      return res.status(500).json({ status: 'error', message: err.message });
    }
  },

  async updatePreferences(req, res) {
    try {
      const userId = req.user && req.user.id;
      const payload = req.body;
      const updated = await service.updatePreferences(userId, payload);
      return res.json({ status: 'success', data: updated.getSummary ? updated.getSummary() : updated });
    } catch (err) {
      console.error('[updatePreferences] Error:', err);
      return res.status(400).json({ status: 'error', message: err.message });
    }
  }
}

module.exports = NotificationPreferenceController;
