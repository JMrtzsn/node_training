const mongoose = require("mongoose")
const validator = require("validator")

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


module.exports = User