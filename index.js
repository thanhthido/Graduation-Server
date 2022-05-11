// libraries
const express = require('express') // thu vien dinh nghia cac route
const bodyParser = require('body-parser')
const cors = require('cors')
const connectMqttBroker = require('./mqtt/MqttInstance')
require('dotenv').config() // thu vien chay environment

// Mongodb
const mongoose = require('mongoose')
const SensorData = require('./models/SensorData')

// connect voi lai mongodb
;(async () => {
	try {
		await mongoose.connect('mongodb://0.0.0.0:27017/sensorDatabase')
		console.log('connect database thanh cong')
	} catch (error) {
		console.log(error)
	}
})()

// connect MQTT
const client = connectMqttBroker(
	process.env.MQTT_URL,
	process.env.MQTT_PORT,
	process.env.MQTT_USERNAME,
	process.env.MQTT_PASSWORD,
)

const MQTT_TOPIC = 'nodeWiFi32/detail'

// subscribe
client.on('connect', () => {
	console.log('mqtt connected')
	client.subscribe(MQTT_TOPIC)
})

// lang nghe topic
client.on('message', async (topic, message) => {
	if (topic === MQTT_TOPIC) {
		const messageData = JSON.parse(message.toString())
		const addTimeMessageData = {
			time: Math.round(Date.now() / 1000),
			...messageData,
		}
		const newSensorData = new SensorData(addTimeMessageData)
		try {
			await newSensorData.save()
			console.log('save data thanh cong')
		} catch (error) {
			console.log(error.message)
		}
	}
})

// routes
const sensorDataRouter = require('./routes/sensorDataRoute')

// constants
const PORT = 8001
const app = express()

// middleWares
app.use(cors())
app.use(bodyParser.json())
app.use('/sensorsData', sensorDataRouter)

app.listen(PORT)
