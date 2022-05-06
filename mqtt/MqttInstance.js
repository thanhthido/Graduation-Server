const mqtt = require('mqtt')

const connectMqttBroker = (brokerUrl, mqttPort, username, password) => {
	const host = `wss://${brokerUrl}:${mqttPort}/mqtt`

	const options = {
		keepalive: 60,
		clean: true,
		useTLS: true,
		protocolVersion: 4,
		reconnectPeriod: 1000,
		connectTimeout: 30 * 1000,
		clientId: '123455668913',
		username,
		password,
		rejectUnauthorized: false,
	}

	return mqtt.connect(host, options)
}

module.exports = connectMqttBroker
