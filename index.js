// libraries
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

// routes
const sensorDataRouter = require('./routes/sensorDataRoute')

// constants
const PORT = 5000
const app = express()

// middleWares
app.use(cors())
app.use(bodyParser.json())
app.use('/sensorsData', sensorDataRouter)

app.listen(PORT)
