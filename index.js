// libraries
const express = require('express') // thu vien dinh nghia cac route
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const connectMqttBroker = require('./mqtt/MqttInstance')
const sensorDataRouter = require('./routes/sensorDataRoute')
mongoose.Promise = global.Promise;

require('dotenv').config() // thu vien chay environment

// Mongodb
const SensorData = require('./models/SensorData')

const {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_NAME,
} = process.env;


const mongoDbUrl= `mongodb://${DB_USER}:${DB_PASSWORD}@mongodb:27017/${DB_NAME}?authSource=admin`

console.log('mongodb connection string:', mongoDbUrl)
// connect voi lai mongodb
mongoose
    .connect(mongoDbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });

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

// constants
const PORT = process.env.PORT || 8001;
const app = express()

// middleWares
app.use(cors())
app.use(bodyParser.json())
app.use('/sensorsData', sensorDataRouter)

app.listen(PORT)
