const express = require('express')
const {
	getAllSensorData,
	getDataBasedType,
} = require('../controller/sensorDataHandlers')

const sensorDataRouter = express.Router()

// route get all data
sensorDataRouter.get('/', getAllSensorData)

// route get data based on type
sensorDataRouter.get('/data', getDataBasedType)

module.exports = sensorDataRouter
