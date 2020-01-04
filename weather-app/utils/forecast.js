const request = require("request")

const forecast = (latitude, longitude, callback) => {
    const url = `https://api.darksky.net/forecast/507974fb261c2a9e82cf5cf53eb4b050/${latitude},${longitude}`
    request({url, json: true, qs: {units: "si"}}, (error, {body}) => {
        if (error) {
            callback("Unable to connect to weather service", undefined)
        } else if (body.error) {
            callback(body.error, undefined)
        } else {
            const temperature = body.currently.temperature
            const precipProbability = body.currently.precipProbability
            const dailySummary = body.daily.data[0].summary
            callback(undefined, `${dailySummary} It is currently ${temperature} degrees out,there is a ${precipProbability}% of rain.`)
        }
    })
}

module.exports = forecast