const fs = require("fs")

const json = JSON.parse(fs.readFileSync("notes_json.json").toString())

json.name = "Agata"
json.age = 27

console.log(json)

fs.writeFileSync("notes_json.json", JSON.stringify(json))

