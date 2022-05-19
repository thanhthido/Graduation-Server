const express = require('express')
const {
	getAllSensorData,
	getDataBasedType,
	getLatestData,
} = require('../controller/sensorDataHandlers')

const sensorDataRouter = express.Router()

// route get all data
sensorDataRouter.get('/', getAllSensorData)

// route get data based on type
sensorDataRouter.get('/data', getDataBasedType)

// route get latest data
sensorDataRouter.get('/data/latest', getLatestData)

module.exports = sensorDataRouter
