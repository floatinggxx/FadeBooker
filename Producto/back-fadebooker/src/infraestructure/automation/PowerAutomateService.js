const axios = require('axios')

const FLOW_URL = process.env.POWER_AUTOMATE_URL

const enviarReserva = async (data) => {
  if (!FLOW_URL) {
    throw new Error('POWER_AUTOMATE_URL no está configurada')
  }

  try {
    const response = await axios.post(FLOW_URL, data)
    return response.data
  } catch (error) {
    console.error('Error Power Automate:', error.message)
    throw error
  }
}

module.exports = {
  enviarReserva
}
