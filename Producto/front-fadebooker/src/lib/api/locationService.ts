import api from '../api'

export const locationService = {
  listRegions: async (): Promise<Array<{ id: any; name: string }>> => {
    const resp = await api.get('/locations/regions')
    return Array.isArray(resp.data) ? resp.data : []
  },

  listComunas: async (region?: any): Promise<Array<{ id: any; name: string }>> => {
    const params = region ? { region } : {}
    const resp = await api.get('/locations/comunas', { params })
    return Array.isArray(resp.data) ? resp.data : []
  }
}
