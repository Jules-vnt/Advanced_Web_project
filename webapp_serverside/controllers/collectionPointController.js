// Routes mounted on /api/collection-points (see server.js)
const express = require('express')
const collectionPointRepository = require('../repositories/collectionPointRepository')
const { sendDbError } = require('../utils/sqlErrors')

const router = express.Router()

const POINT_TYPES = ['street_bin', 'drop_off_center', 'container', 'business']

// Returns an error message, or null if the body is valid
function validate(p) {
  if (!p || !p.name || !String(p.name).trim()) return 'The name is required'
  if (!p.city || !String(p.city).trim()) return 'The city is required'
  if (!POINT_TYPES.includes(p.point_type)) return 'Unknown point type'
  if (p.latitude != null && (isNaN(p.latitude) || p.latitude < -90 || p.latitude > 90)) {
    return 'The latitude must be between -90 and 90'
  }
  if (p.longitude != null && (isNaN(p.longitude) || p.longitude < -180 || p.longitude > 180)) {
    return 'The longitude must be between -180 and 180'
  }
  return null
}

// GET /api/collection-points
router.get('/', async (req, res) => {
  try {
    res.json(await collectionPointRepository.getAll())
  } catch (err) {
    sendDbError(res, err, 'collection points')
  }
})

// GET /api/collection-points/:id
router.get('/:id', async (req, res) => {
  try {
    const point = await collectionPointRepository.getById(req.params.id)
    if (!point) {
      return res.status(404).json({ error: 'Collection point not found' })
    }
    res.json(point)
  } catch (err) {
    sendDbError(res, err, 'collection point')
  }
})

// GET /api/collection-points/:id/collections
router.get('/:id/collections', async (req, res) => {
  try {
    res.json(await collectionPointRepository.getCollections(req.params.id))
  } catch (err) {
    sendDbError(res, err, 'collections')
  }
})

// POST /api/collection-points
router.post('/', async (req, res) => {
  const error = validate(req.body)
  if (error) {
    return res.status(400).json({ error })
  }
  try {
    const id = await collectionPointRepository.create(req.body)
    res.status(201).json(await collectionPointRepository.getById(id))
  } catch (err) {
    sendDbError(res, err, 'collection point')
  }
})

// PUT /api/collection-points/:id
router.put('/:id', async (req, res) => {
  const error = validate(req.body)
  if (error) {
    return res.status(400).json({ error })
  }
  try {
    const updated = await collectionPointRepository.update(req.params.id, req.body)
    if (!updated) {
      return res.status(404).json({ error: 'Collection point not found' })
    }
    res.json(await collectionPointRepository.getById(req.params.id))
  } catch (err) {
    sendDbError(res, err, 'collection point')
  }
})

// DELETE /api/collection-points/:id (its collections are deleted too: ON DELETE CASCADE)
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await collectionPointRepository.remove(req.params.id)
    if (!deleted) {
      return res.status(404).json({ error: 'Collection point not found' })
    }
    res.status(204).end()
  } catch (err) {
    sendDbError(res, err, 'collection point')
  }
})

module.exports = router
