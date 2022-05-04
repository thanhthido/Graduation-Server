const FakeSensorDatas = [
	{
		temperature: {
			type: 'normal',
			value: 43,
			message: 'abc',
		},
		humidity: {
			type: 'normal',
			value: 24,
			message: 'abc',
		},
	},
	{
		temperature: {
			type: 'normal',
			value: 44,
			message: 'abc',
		},
		humidity: {
			type: 'error',
			value: 25,
			message: 'abc',
		},
	},
]

const humidityArray = FakeSensorDatas.filter((data) => {
	return data.humidity
})

const emptyData = []

module.exports = emptyData
