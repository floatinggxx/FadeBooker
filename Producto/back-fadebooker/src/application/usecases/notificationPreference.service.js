class NotificationPreferenceService {
  constructor(notificationPreferenceRepository) {
    this.notificationPreferenceRepository = notificationPreferenceRepository;
  }

  async getPreferences(userId) {
    const prefs = await this.notificationPreferenceRepository.findByUserId(userId);
    return prefs;
  }

  async updatePreferences(userId, data) {
    return await this.notificationPreferenceRepository.createOrUpdate(userId, data);
  }
}

module.exports = NotificationPreferenceService;
