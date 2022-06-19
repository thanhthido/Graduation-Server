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
		clientId: 'dsadsadasdsa213123123',
		username,
		password,
		rejectUnauthorized: true,
	}

	return mqtt.connect(host, options)
}

module.exports = connectMqttBroker
