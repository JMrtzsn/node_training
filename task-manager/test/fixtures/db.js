const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const User = require("../../src/models/user")
const Task = require("../../src/models/task")

const testUserId = new mongoose.Types.ObjectId()

const testUser = {
    _id: testUserId,
    name: "Test",
    email: "TestUser@test.com",
    password: "NNoNoNO123!",
    tokens: [{
        token: jwt.sign({_id: testUserId}, process.env.JWT_TOKEN)
    }]
}

const testUserId2 = new mongoose.Types.ObjectId()

const testUser2 = {
    _id: testUserId2,
    name: "Test2",
    email: "TestUser2@test.com",
    password: "NNoNoNO123!",
    tokens: [{
        token: jwt.sign({_id: testUserId2}, process.env.JWT_TOKEN)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: "First Task",
    completed: false,
    owner: testUserId._id
}


const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: "Sec Task",
    completed: true,
    owner: testUser._id
}


const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: "Third Task",
    completed: true,
    owner: testUser2._id
}

const setupDB = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(testUser).save()
    await new User(testUser2).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    testUser,
    testUserId,
    testUser2,
    testUserId2,
    taskOne,
    setupDB
}