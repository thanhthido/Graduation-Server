const SensorData = require('../models/SensorData')

const getAllSensorData = async (req, res) => {
	try {
		const { page = 1, limit = 15, event } = req.query
		let totalSensorData = 0

		let desiredArray = []

		if (event !== 'all') {
			const getAllDataType = await SensorData.find(
				{ event: `${event}` },
				{ __v: 0 },
			)

			const sensorDataList = await SensorData.find(
				{ event: `${event}` },
				{ __v: 0 },
			)
				.sort({ time: -1 })
				.limit(limit)
				.skip((page - 1) * limit)
			desiredArray = sensorDataList

			totalSensorData = getAllDataType.length
		} else {
			const getAllDataType = await SensorData.find({})
			const sensorDataList = await SensorData.find({}, { __v: 0 })
				.sort({ time: -1 })
				.limit(limit)
				.skip((page - 1) * limit)
			desiredArray = sensorDataList

			totalSensorData = getAllDataType.length
		}

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
	let totalMapTypeList = []
	let totalDesiredData = 0

	if (sensorDataList.length === 0) return { totalDesiredData, mapTypeList }

	const listOfType = ['temperature', 'co', 'no2', 'ch4', 'pm1', 'pm25', 'pm10']

	// for cho type
	for (let index = 0; index < listOfType.length; index++) {
		const typeToCheck = listOfType[index]

		if (typeToCheck === type && type.length !== '' && event !== 'all') {
			mapTypeList = await SensorData.find(
				{ type: `${type}`, event: `${event}` },
				{ __v: 0 },
			)
				.limit(limit)
				.skip((page - 1) * limit)
				.sort({ time: -1 })

			totalMapTypeList = await SensorData.find({
				type: `${type}`,
				event: `${event}`,
			})

			break
		}

		if (typeToCheck === type && type.length !== '' && event === 'all') {
			mapTypeList = await SensorData.find({ type: `${type}` }, { __v: 0 })
				.limit(limit)
				.skip((page - 1) * limit)
				.sort({ time: -1 })

			totalMapTypeList = await SensorData.find({
				type: `${type}`,
			})

			break
		}
	}

	let mapDesiredData = [...mapTypeList]
	totalDesiredData = totalMapTypeList.length

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

const mapLatestData = async () => {
	const { value: tempValue } = await SensorData.find({
		time: { $gt: 0 },
		type: 'temperature',
	})
		.sort({ time: -1 })
		.findOne(
			{ type: 'temperature' },
			{ _id: 0, __v: 0, event: 0, msg: 0, time: 0, type: 0 },
		)

	const { value: coValue } = await SensorData.find({
		time: { $gt: 0 },
		type: 'co',
	})
		.sort({ time: -1 })
		.findOne(
			{ type: 'co' },
			{ _id: 0, __v: 0, event: 0, msg: 0, time: 0, type: 0 },
		)

	const { value: no2Value } = await SensorData.find({
		time: { $gt: 0 },
		type: 'no2',
	})
		.sort({ time: -1 })
		.findOne(
			{ type: 'no2' },
			{ _id: 0, __v: 0, event: 0, msg: 0, time: 0, type: 0 },
		)

	const { value: ch4Value } = await SensorData.find({
		time: { $gt: 0 },
		type: 'ch4',
	})
		.sort({ time: -1 })
		.findOne(
			{ type: 'ch4' },
			{ _id: 0, __v: 0, event: 0, msg: 0, time: 0, type: 0 },
		)

	const { value: pm25Value } = await SensorData.find({
		time: { $gt: 0 },
		type: 'pm25',
	})
		.sort({ time: -1 })
		.findOne(
			{ type: 'pm25' },
			{ _id: 0, __v: 0, event: 0, msg: 0, time: 0, type: 0 },
		)

	const { value: pm1Value } = await SensorData.find({
		time: { $gt: 0 },
		type: 'pm1',
	})
		.sort({ time: -1 })
		.findOne(
			{ type: 'pm1' },
			{ _id: 0, __v: 0, event: 0, msg: 0, time: 0, type: 0 },
		)

	const { value: pm10Value } = await SensorData.find({
		time: { $gt: 0 },
		type: 'pm10',
	})
		.sort({ time: -1 })
		.findOne(
			{ type: 'pm10' },
			{ _id: 0, __v: 0, event: 0, msg: 0, time: 0, type: 0 },
		)

	const { time } = await SensorData.find({ time: { $gt: 0 } })
		.sort({ time: -1 })
		.findOne({ time: { $gt: 0 } })

	return {
		time,
		tempValue,
		coValue,
		no2Value,
		ch4Value,
		pm25Value,
		pm1Value,
		pm10Value,
	}
}

const getLatestData = async (req, res) => {
	try {
		const latestData = await mapLatestData()
		res.status(200).json(latestData)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

module.exports = { getAllSensorData, getDataBasedType, getLatestData }
