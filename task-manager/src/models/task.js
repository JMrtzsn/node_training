const mongoose = require("mongoose")
const validator = require("validator")

const Task = mongoose.model("Task", {
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        optional: true,
        default: false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectID,
        required: true
    }
})

module.exports = Task