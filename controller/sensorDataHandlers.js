const SensorData = require('../models/SensorData')

const getAllSensorData = async (req, res) => {
	try {
		const sensorDataList = await SensorData.find({}, { __v: 0 })
		res.status(200).json(sensorDataList)
	} catch (error) {
		res.status(404).json({ message: error.message })
	}
}

const mapData = async (type) => {
	const sensorDataList = await SensorData.find()

	if (sensorDataList.length === 0) return []

	let mapDesiredData = []
	const listOfType = ['temperature', 'co', 'no2', 'ch4', 'pm1', 'pm25', 'pm10']

	for (let index = 0; index < listOfType.length; index++) {
		const typeToCheck = listOfType[index]

		if (typeToCheck === type) {
			mapDesiredData = await SensorData.find({ type: `${type}` }, { __v: 0 })
			break
		}
	}

	return mapDesiredData
}

const getDataBasedType = async (req, res) => {
	try {
		const responseData = await mapData(req.query.type)
		res.status(200).json(responseData)
	} catch (error) {
		res.status(404).json({ message: error.message })
	}
}

module.exports = { getAllSensorData, getDataBasedType }
