const request = require("request")
/*let url = "https://api.darksky.net/forecast/507974fb261c2a9e82cf5cf53eb4b050/37.8267,-122.4233"
request({url: url, json: true, qs: {units:"si"}}, (error, response) => {
    if (error){
        console.log("Unable to connect to weather service")
        return
    }
    if (response.body.error){
        console.log(response.body.error)
        return
    }
    const temperature = response.body.currently.temperature
    const precipProbability = response.body.currently.precipProbability
    const dailySummary = response.body.daily.data[0].summary
    console.log(`${dailySummary} It is currently ${temperature} degrees out,there is a ${precipProbability}% of rain.`)
})*/

/*


    console.log("Latitude " + response.body.features[0].center[0] + " Longitude " + response.body.features[0].center[1],)
} ) */

const geocode = (address, callback) => {
    const url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + encodeURIComponent(address) + ".json"
    const propertiesObject = {
        json: true,
        qs: {
            limit: 1,
            access_token: "pk.eyJ1Ijoiam1hdXJpdHoiLCJhIjoiY2s0c2E2dGEyMGpjaTNtbjBjYjcxcDI0MSJ9.INOVrYsGEQWUS5MqUdO4Xg"
        }
    }
    request.get(url, propertiesObject, (error, response) => {
        if (error) {
            callback(error, undefined)

        } else if (response.body.message) {
            callback(response.body.message, undefined)

        } else if (response.body.features.length === 0) {
            callback("No locations found", undefined)
        }
        callback(undefined, {
            latitude: response.body.features[0].center[0],
            longitude: response.body.features[0].center[1],
            location: response.body.features[0].place_name,
        })
    })
}

geocode("Boston", (error, data) => {
    console.log("error", error)
    console.log("data", data)
})

