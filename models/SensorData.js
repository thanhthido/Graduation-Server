const mongoose = require('mongoose')

const sensorDataSchema = mongoose.Schema({
	type: String, // temp, humidity,...
	value: Number,
	event: {
		type: String,
		default: 'normal', // normal, error,...
	},
	time: {
		type: Date,
		default: new Date(),
	},
})

const SensorData = mongoose.model('SensorData', sensorDataSchema)

module.exports = SensorData
