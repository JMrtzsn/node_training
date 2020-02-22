const mongoose = require("mongoose")
const connection = "mongodb://127.0.0.1:27017/task-manager-api"

mongoose.connect(connection, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

