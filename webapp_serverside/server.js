require('dotenv').config()
const express = require('express')
const cors = require('cors')

const treatmentCenterController = require('./controllers/treatmentCenterController')
const collectionPointController = require('./controllers/collectionPointController')

const app = express()
app.use(cors())
app.use(express.json())

// Files of the static folder, e.g. http://localhost:9000/static/ping.txt
app.use('/static', express.static(__dirname + '/static'))

// API routes, e.g. http://localhost:9000/api/treatment-centers
app.use('/api/treatment-centers', treatmentCenterController)
app.use('/api/collection-points', collectionPointController)

app.listen(process.env.PORT, () => {
  console.log(`Server listening on http://localhost:${process.env.PORT}`)
})
