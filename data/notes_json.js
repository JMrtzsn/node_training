const fs = require("fs")

const book = {
    title: "Lord of the rings",
    author: "J.R.R.Tolkien"
}

const bookJSON = JSON.stringify(book)
fs.writeFileSync("notes_json.json", bookJSON)