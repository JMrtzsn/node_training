const geocode = require("./utils/geocode")
const forecast = require("./utils/forecast")

const location = process.argv[2];
if (location != undefined) {
    console.log("provide an input location")

}
geocode(location, (geocodeError, {latitude, longitude, location}) => {
    if (geocodeError) {
        return console.log(geocodeError)
    }
    forecast(latitude, longitude,
        (forecastError, forecastData) => {
            if (forecastError) {
                return console.log(forecastError)
            }
            console.log('Data', forecastData)
        })
})