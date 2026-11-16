// Routes mounted on /api/treatment-centers (see server.js)
const express = require('express')
const treatmentCenterRepository = require('../repositories/treatmentCenterRepository')

const router = express.Router()

// GET /api/treatment-centers
router.get('/', async (req, res) => {
  try {
    const centers = await treatmentCenterRepository.getAll()
    res.json(centers)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not read the treatment centers' })
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
    console.error(err)
    res.status(500).json({ error: 'Could not read the treatment center' })
  }
})

module.exports = router
