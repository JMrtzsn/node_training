const notes = require("./notes")
const yargs = require("yargs")

yargs.command({
    command: "add",
    describe: "Add a new note",
    builder: {
        title: {
            describe: "Note title",
            demandOption: true,
            type: "string"
        },
        body: {
            describe: "Note body",
            demandOption: true,
            type: "string"
        }
    },
    handler(argv) {
        notes.addNote(argv.title, argv.body)
    },
})

yargs.command({
    command: "remove",
    describe: "Removing a note",
    builder: {
        title: {
            describe: "Note title",
            demandOption: true,
            type: "string"
        },
    },
    handler(argv) {
        notes.removeNote(argv.title)
    }
})


yargs.command({
    command: "list",
    describe: "list notes",
    handler() {
        notes.listNotes()
    }
})


yargs.command({
    command: "read",
    describe: "Read note",
    builder: {
        title: {
            describe: "Note title",
            demandOption: true,
            type: "string"
        },
    },
    handler(argv) {
        notes.readNote(argv.title)
    }
})

yargs.parse()
