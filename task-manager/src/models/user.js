const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Task = require("./task")
const sharp = require("sharp")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
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
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true
    },
    tokens: [{
        token: {
            type: String,
            required: true,

        }
    }],
    avatar:{
        type: Buffer
    }
}, {
    timestamps: true
})

// Virtual db reference (field), wont be stored in the DB
userSchema.virtual("tasks",{
    ref: "Task",
    // PK
    localField: "_id",
    // FK
    foreignField: "owner"
})

userSchema.methods.toJSON = function () {
    const user = this.toObject()
    delete user.tokens
    delete user.password
    delete user.avatar
    return user
}


userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, "secretstring")

    user.tokens = user.tokens.concat({token: token})
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    const passwordCorrect = await bcrypt.compare(password, user.password)

    if (!user || !passwordCorrect) {
        throw new Error("Unable to Login")
    }

    return user
}

// Hash plain text password, runs when a user is saved / created
userSchema.pre("save", async function (next) {
    try {
        const user = this
        if (user.isModified("password")) {
            user.password = await bcrypt.hash(user.password, 8)
        }
    } catch (e) {
        throw new Error(e)
    }
    next()
})

// Delete user tasks when user is removed, runs when remove command is executed
userSchema.pre("remove", async function (next) {
    const user = this
    await Task.deleteMany({owner: user._id})
    next()
})

const User = mongoose.model("User", userSchema)


module.exports = User