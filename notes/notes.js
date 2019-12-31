const fs = require("fs")
const chalk = require("chalk")


const removeNote = (title) => {
    const notes = loadNotes()
    console.log(`Removing title ${title}`)
    const updatedNotes = notes.filter(note => note.title !== title)
    if (updatedNotes.length !== notes.length) {
        console.log(chalk.green.inverse("Removed Title successfully"))
        saveNotes(updatedNotes)
    } else {
        console.log(chalk.red.inverse("Title not found"))
    }
}

const addNote = (title, body) => {
    const notes = loadNotes()
    const duplicateTitle = notes.find(note => note.title === title)
    if (!duplicateTitle) {
        notes.push({
            title: title,
            body: body,
        })
        saveNotes(notes)
        console.log(chalk.green.inverse("New note added"))
    } else {
        console.log(chalk.red.inverse("Title already added"))
    }

}

const saveNotes = (notes) => {
    fs.writeFileSync("notes.json", JSON.stringify(notes))
}

const loadNotes = () => {
    try {
        return JSON.parse(fs.readFileSync("notes.json").toString())
    } catch (e) {
        return []
    }
}

const listNotes = () => {
    console.log(chalk.blue("Your notes"))
    console.log(loadNotes().map(value => value.title))
}

const readNote = (title) => {
    console.log(chalk.blue.inverse(`Reading note ${title}`))
    const retrivedNote = loadNotes().find(notes => notes.title === title)
    if (!retrivedNote) {
        console.log(chalk.red.inverse("Couldnt Find Note"))
        return
    }
    console.log(chalk.green(retrivedNote.title) + "\n"
        + retrivedNote.body)
}

module.exports = {
    addNote: addNote,
    removeNote: removeNote,
    listNotes: listNotes,
    readNote: readNote,
};
