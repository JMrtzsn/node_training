// CRUD
const {MongoClient, ObjectID} = require("mongodb")


MongoClient.connect(process.env.CONNECTION_URL, {useUnifiedTopology: true}, (error, client) => {
    if (error) {
        return console.log("Unable to connect to DB, reason: " + error.message)
    }
})