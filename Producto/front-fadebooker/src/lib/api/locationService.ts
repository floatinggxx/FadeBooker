import api from '../api'
import regionesChile from '../data/regionesChile'

export const locationService = {
  listRegions: async (): Promise<Array<{ id: any; name: string }>> => {
    try {
      const resp = await api.get('/locations/regions')
      return Array.isArray(resp.data) ? resp.data : []
    } catch (err) {
      // fallback to local static catalog
      return regionesChile.map(r => ({ id: r.id, name: r.nombre }))
    }
  },

  listComunas: async (region?: any): Promise<Array<{ id: any; name: string }>> => {
    const params = region ? { region } : {}
    try {
      const resp = await api.get('/locations/comunas', { params })
      return Array.isArray(resp.data) ? resp.data : []
    } catch (err) {
      // fallback to local static catalog
      if (region) {
        const found = regionesChile.find(r => String(r.id) === String(region) || r.nombre === region)
        if (found) return found.comunas.map((c, idx) => ({ id: idx + 1, name: c }))
      }
      // return all comunas deduped
      const all: Array<{ id: number; name: string }> = []
      const seen = new Set<string>()
      regionesChile.forEach(r => r.comunas.forEach(c => {
        const norm = String(c).toLowerCase()
        if (!seen.has(norm)) { seen.add(norm); all.push({ id: all.length + 1, name: c }) }
      }))
      return all
    }
  }
}
