const express = require("express")
const path = require("path")
const app = express()
const hbs = require("hbs")
const geocode = require("./utils/geocode")
const forecast = require("./utils/forecast")
// Start the server
const PORT = process.env.PORT || 3000;


// Setup Handlebars engine and views location
app.set("view engine", "hbs")
app.set("views", path.join(__dirname, "../templates/views"))
hbs.registerPartials(path.join(__dirname, "../templates/partials"))
//setup static dir to serve
app.use(express.static(path.join(__dirname, "../public")))

app.get("", (req, res) => {
    res.render("index", {
        title: "Weather",
        name: "Kepler"
    })
})

app.get("/about", (req, res) => {
    res.render("about", {
        title: "About Me",
        name: "Kepler"
    })
})

app.get("/help", (req, res) => {
    res.render("help", {
        title: "Help",
        message: "You must be truly desperate to come for my help",
        name: "Kepler"
    })
})

app.get("/weather", (req, res) => {
    const address = req.query.address
    if (!address) {
        return res.send({
            error: "Please provide an address"
        })
    }
    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({
                error
            })
        }
        forecast(latitude, longitude,
            (error, forecast) => {
                if (error) {
                    return res.send({
                        error
                    })
                }
                return res.send({
                    address,
                    forecast,
                    location
                })
            })
    })
})

app.get("/products", (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: "Please provide a search term"
        })
    }
    return res.send({
        products: []
    })
})

app.get("/help/*", (req, res) => {
    res.render("404", {
        title: "404",
        message: "Help Article not found",
        name: "Kepler"
    })
})

app.get("*", (req, res) => {
    res.render("404", {
        title: "404",
        message: "Not Found",
        name: "Kepler"
    })
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});