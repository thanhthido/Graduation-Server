const SensorData = require('../models/SensorData')

const getAllSensorData = async (req, res) => {
	try {
		const { page = 1, limit = 15 } = req.query
		const totalSensorData = await SensorData.find()
		const sensorDataList = await SensorData.find({}, { __v: 0 })
			.sort({ time: -1 })
			.limit(limit)
			.skip((page - 1) * limit)
		res.status(200).json({
			total: totalSensorData.length,
			page: parseInt(page),
			sensorDataList,
		})
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

const mapData = async (type, page, limit) => {
	const sensorDataList = await SensorData.find()

	let mapDesiredData = []
	let totalDesiredData = 0

	if (sensorDataList.length === 0) return { totalDesiredData, mapDesiredData }

	const listOfType = ['temperature', 'co', 'no2', 'ch4', 'pm1', 'pm25', 'pm10']

	for (let index = 0; index < listOfType.length; index++) {
		const typeToCheck = listOfType[index]

		if (typeToCheck === type) {
			const desiredDataList = await SensorData.find(
				{ type: `${type}` },
				{ __v: 0 },
			)
			totalDesiredData = desiredDataList.length

			mapDesiredData = await SensorData.find({ type: `${type}` }, { __v: 0 })
				.limit(limit)
				.skip((page - 1) * limit)
			break
		}
	}

	return { totalDesiredData, mapDesiredData }
}

const getDataBasedType = async (req, res) => {
	try {
		const { page = 1, limit = 15 } = req.query
		const { totalDesiredData, mapDesiredData } = await mapData(
			req.query.type,
			page,
			limit,
		)
		res.status(200).json({
			total: totalDesiredData,
			page: parseInt(page),
			sensorDataList: mapDesiredData,
		})
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

module.exports = { getAllSensorData, getDataBasedType }
