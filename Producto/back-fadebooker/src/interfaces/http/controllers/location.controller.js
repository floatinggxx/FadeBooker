const db = require('../../../db/knex')
const regionesChile = require('../../../infraestructure/data/regionesChile')

const normalizeText = (value) => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .trim()

const LocationController = {
  async listRegions(req, res) {
    try {
      const staticRegions = regionesChile.map(r => ({ id: r.id, name: r.nombre }))

      const hasRegionTable = await db.schema.hasTable('Region')
      if (hasRegionTable) {
        const regions = await db('Region').select('id_region as id', 'nombre as name').orderBy('nombre')
        if (Array.isArray(regions) && regions.length > 0) {
          // merge DB regions with static catalog, avoid duplicates by normalized name
          const merged = [...regions]
          const known = new Set(regions.map(r => normalizeText(r.name)))
          staticRegions.forEach(r => {
            if (!known.has(normalizeText(r.name))) merged.push(r)
          })
          // final dedupe pass in case of subtle duplicates
          const uniq = []
          const seen = new Set()
          merged.forEach(r => {
            const n = normalizeText(r.name)
            if (!seen.has(n)) {
              seen.add(n)
              uniq.push(r)
            }
          })
          return res.json(uniq)
        }
      }

      return res.json(staticRegions)
    } catch (error) {
      console.error('Error listing regions', error)
      return res.status(500).json({ error: 'Error listing regions' })
    }
  },

  async listComunas(req, res) {
    try {
      const { region } = req.query

      if (region) {
        const regionNorm = normalizeText(region)
        const foundStatic = regionesChile.find(r => {
          const nameNorm = normalizeText(r.nombre)
          return String(r.id) === String(region) ||
            nameNorm === regionNorm ||
            nameNorm.includes(regionNorm) ||
            regionNorm.includes(nameNorm)
        })
        if (foundStatic) {
          const comunas = foundStatic.comunas.map((name, idx) => ({ id: idx + 1, name }))
          return res.json(comunas)
        }
      }

      const hasComunaTable = await db.schema.hasTable('Comuna')
      if (hasComunaTable) {
        let q = db('Comuna').select('id_comuna as id', 'nombre as name', 'id_region').orderBy('nombre')
        if (region) q = q.where('id_region', region)
        const comunas = await q
        if (Array.isArray(comunas) && comunas.length > 0) return res.json(comunas)
      }

      // Build a deduplicated list of all comunas from the static catalog
      const all = []
      const seen = new Set()
      regionesChile.forEach(r => {
        r.comunas.forEach(c => {
          const norm = normalizeText(c)
          if (!seen.has(norm)) {
            seen.add(norm)
            all.push({ id: all.length + 1, name: c })
          }
        })
      })
      return res.json(all)
    } catch (error) {
      console.error('Error listing comunas', error)
      return res.status(500).json({ error: 'Error listing comunas' })
    }
  }
}

module.exports = LocationController
