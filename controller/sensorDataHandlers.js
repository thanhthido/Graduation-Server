const SensorData = require('../models/SensorData')

const getAllSensorData = async (req, res) => {
	try {
		const { page = 1, limit = 15 } = req.query
		const sensorDataList = await SensorData.find({}, { __v: 0 })
			.limit(limit)
			.skip((page - 1) * limit)
		res
			.status(200)
			.json({
				total: sensorDataList.length,
				page: parseInt(page),
				sensorDataList,
			})
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

const mapData = async (type, page, limit) => {
	const sensorDataList = await SensorData.find()

	if (sensorDataList.length === 0) return []

	let mapDesiredData = []
	const listOfType = ['temperature', 'co', 'no2', 'ch4', 'pm1', 'pm25', 'pm10']

	for (let index = 0; index < listOfType.length; index++) {
		const typeToCheck = listOfType[index]

		if (typeToCheck === type) {
			mapDesiredData = await SensorData.find({ type: `${type}` }, { __v: 0 })
				.limit(limit)
				.skip((page - 1) * limit)
			break
		}
	}

	return mapDesiredData
}

const getDataBasedType = async (req, res) => {
	try {
		const { page = 1, limit = 15 } = req.query
		const responseData = await mapData(req.query.type, page, limit)
		res.status(200).json({
			total: responseData.length,
			page: parseInt(page),
			sensorDataList: responseData,
		})
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

module.exports = { getAllSensorData, getDataBasedType }
