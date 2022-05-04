const express = require('express')
const {
	getAllSensorData,
	postDataHandler,
	getDataBasedType,
} = require('../controller/sensorDataHandlers')

const sensorDataRouter = express.Router()

sensorDataRouter.get('/', getAllSensorData)
sensorDataRouter.post('/', postDataHandler)
sensorDataRouter.get('/:type', getDataBasedType)

module.exports = sensorDataRouter
