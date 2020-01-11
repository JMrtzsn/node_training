const mongoose = require("mongoose")
const validator = require("validator")
const connection = "mongodb://127.0.0.1:27017/task-manager-api"
mongoose.connect(connection, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const User = mongoose.model("User", {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("email is invalid")
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Age below 0")
            }
        }
    },
    password:{
        type: String,
        required: true,
        minlength: 7,
        trim:true,
        match: /^((?!password).)*$/igm
    }
})

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
    }
})


const me = new Task({
    description: "         Programming Session saturday",
})

me.save().then((r) => {
    console.log(r)
}).catch((e) => {
    console.log(e.message)
}).finally(() => {
    process.exit(0)
})
