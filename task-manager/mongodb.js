// CRUD
const {MongoClient, ObjectID} = require("mongodb")

const connectionURL = "mongodb://127.0.0.1:27017"
const databaseName = "task-manager"

MongoClient.connect(connectionURL, {useUnifiedTopology: true}, (error, client) => {
    if (error) {
        return console.log("Unable to connect to DB, reason: " + error.message)
    }
    const db = client.db(databaseName)

    db.collection("tasks").deleteOne({
            description: "Do the Laundry"
        }
    ).then((r) => {
        console.log(r)
    }).catch((e) => {
        console.log(e)
    })
})