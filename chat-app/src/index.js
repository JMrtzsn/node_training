const express = require("express")
const path = require("path")
const app = express()

const port = process.env.PORT || 3000

const dirpath = path.join(__dirname, "../public")
app.use(express.json())

app.get("", (req, res) => {
    res.sendFile(path.join(dirpath + "/index.html"))
})

app.listen(port, () => {
    console.log(" Server is up on port " + port)
})
