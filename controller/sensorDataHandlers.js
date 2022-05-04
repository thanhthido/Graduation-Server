const datas = require('../models/SensorData')

const getAllSensorData = (req, res) => {
	res.status(200).json([...datas])
}

const postDataHandler = (req, res) => {
	try {
		const sensorData = req.body
		datas.push(sensorData)
		res.status(200).json({ message: 'Thanh cong them vao database' })
	} catch (error) {
		res.status(403).json({ message: error.message })
	}
}

function mapData(type) {
	let mapDesiredData = [...datas]

	if (type === 'temperature') {
		mapDesiredData = datas.map((data) => data.temperature)
	}

	if (type === 'humidity') {
		mapDesiredData = datas.map((data) => data.humidity)
	}

	return mapDesiredData
}

const getDataBasedType = (req, res) => {
	const { type } = req.params
	const responseData = mapData(type)
	res.status(200).json(responseData)
}

module.exports = { getAllSensorData, postDataHandler, getDataBasedType }
