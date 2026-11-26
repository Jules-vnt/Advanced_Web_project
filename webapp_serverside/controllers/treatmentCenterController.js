// Routes mounted on /api/treatment-centers (see server.js)
const express = require('express')
const treatmentCenterRepository = require('../repositories/treatmentCenterRepository')
const collectionPointRepository = require('../repositories/collectionPointRepository')
const { sendDbError } = require('../utils/sqlErrors')

const router = express.Router()

// Returns an error message, or null if the body is valid
function validate(c) {
  if (!c || !c.name || !String(c.name).trim()) return 'The name is required'
  if (!c.city || !String(c.city).trim()) return 'The city is required'
  if (c.capacity_tons != null && (isNaN(c.capacity_tons) || c.capacity_tons < 0)) {
    return 'The capacity must be a positive number'
  }
  return null
}

// GET /api/treatment-centers
router.get('/', async (req, res) => {
  try {
    res.json(await treatmentCenterRepository.getAll())
  } catch (err) {
    sendDbError(res, err, 'treatment centers')
  }
})

// GET /api/treatment-centers/:id
router.get('/:id', async (req, res) => {
  try {
    const center = await treatmentCenterRepository.getById(req.params.id)
    if (!center) {
      return res.status(404).json({ error: 'Treatment center not found' })
    }
    res.json(center)
  } catch (err) {
    sendDbError(res, err, 'treatment center')
  }
})

// GET /api/treatment-centers/:id/collection-points
router.get('/:id/collection-points', async (req, res) => {
  try {
    res.json(await collectionPointRepository.getByCenter(req.params.id))
  } catch (err) {
    sendDbError(res, err, 'collection points')
  }
})

// POST /api/treatment-centers
router.post('/', async (req, res) => {
  const error = validate(req.body)
  if (error) {
    return res.status(400).json({ error })
  }
  try {
    const id = await treatmentCenterRepository.create(req.body)
    res.status(201).json(await treatmentCenterRepository.getById(id))
  } catch (err) {
    sendDbError(res, err, 'treatment center')
  }
})

// PUT /api/treatment-centers/:id
router.put('/:id', async (req, res) => {
  const error = validate(req.body)
  if (error) {
    return res.status(400).json({ error })
  }
  try {
    const updated = await treatmentCenterRepository.update(req.params.id, req.body)
    if (!updated) {
      return res.status(404).json({ error: 'Treatment center not found' })
    }
    res.json(await treatmentCenterRepository.getById(req.params.id))
  } catch (err) {
    sendDbError(res, err, 'treatment center')
  }
})

// DELETE /api/treatment-centers/:id
// Its collection points are kept (center_id set to NULL); refused (409) while collections use it.
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await treatmentCenterRepository.remove(req.params.id)
    if (!deleted) {
      return res.status(404).json({ error: 'Treatment center not found' })
    }
    res.status(204).end()
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.code === 'ER_ROW_IS_REFERENCED') {
      return res.status(409).json({
        error: 'This treatment center still has collections. Delete or move them first.'
      })
    }
    sendDbError(res, err, 'treatment center')
  }
})

module.exports = router
