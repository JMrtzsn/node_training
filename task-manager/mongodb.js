// CRUD
const {MongoClient, ObjectID} = require("mongodb")


MongoClient.connect(process.env.CONNECTION_URL, {useUnifiedTopology: true}, (error, client) => {
    if (error) {
        return console.log("Unable to connect to DB, reason: " + error.message)
    }
    const db = client.db(process.env.DATABASE_NAME)

    db.collection("tasks").deleteOne({
            description: "Do the Laundry"
        }
    ).then((r) => {
        console.log(r)
    }).catch((e) => {
        console.log(e)
    })
})