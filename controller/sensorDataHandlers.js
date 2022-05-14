const SensorData = require('../models/SensorData')

const getAllSensorData = async (req, res) => {
	try {
		const { page = 1, limit = 15, event } = req.query
		let totalSensorData = 0

		const sensorDataList = await SensorData.find({}, { __v: 0 })
			.sort({ time: -1 })
			.limit(limit)
			.skip((page - 1) * limit)

		let desiredArray = [...sensorDataList]

		if (event === 'normal') {
			desiredArray = sensorDataList.filter(
				(sensorData) => sensorData.event === 'normal',
			)
		} else if (event === 'error') {
			desiredArray = sensorDataList.filter(
				(sensorData) => sensorData.event === 'error',
			)
		}

		totalSensorData = desiredArray.length

		res.status(200).json({
			total: totalSensorData,
			page: parseInt(page),
			sensorDataList: desiredArray,
		})
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

const mapData = async (type, page, limit, event) => {
	const sensorDataList = await SensorData.find()

	let mapTypeList = []
	let totalDesiredData = 0

	if (sensorDataList.length === 0) return { totalDesiredData, mapTypeList }

	const listOfType = ['temperature', 'co', 'no2', 'ch4', 'pm1', 'pm25', 'pm10']
	const listOfEvent = ['all', 'normal', 'error']

	// for cho type
	for (let index = 0; index < listOfType.length; index++) {
		const typeToCheck = listOfType[index]

		if (typeToCheck === type && type.length !== '') {
			mapTypeList = await SensorData.find({ type: `${type}` }, { __v: 0 })
				.limit(limit)
				.skip((page - 1) * limit)
			break
		}
	}

	let mapDesiredData = [...mapTypeList]
	totalDesiredData = mapDesiredData.length

	// for cho event
	for (let index = 0; index < listOfEvent.length; index++) {
		const eventToCheck = listOfEvent[index]

		if (
			eventToCheck === event &&
			event.length !== '' &&
			eventToCheck !== 'all'
		) {
			mapDesiredData = mapTypeList.filter(
				(sensorData) => sensorData.event === event,
			)
			totalDesiredData = mapDesiredData.length
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
			req.query.event,
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
