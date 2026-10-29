require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// Files of the static folder, e.g. http://localhost:9000/static/ping.txt
app.use('/static', express.static(__dirname + '/static'))

app.listen(process.env.PORT, () => {
  console.log(`Server listening on http://localhost:${process.env.PORT}`)
})
