const express = require("express")
require("./db/mongoose")
const User = require("./models/user")
const Task = require("./models/task")
const app = express()

const port = process.env.PORT || 3000

app.use(express.json())

app.post("/users", async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

app.get("/users", async (req, res) => {
    try {
        const users = await User.find({})
        res.status(201).send(users)
    } catch (e) {
        res.status(500).send(e)
    }
})


app.get("/users/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

app.patch("/users/:id", async (req, res) => {
    if (containsUnknownItems(User, req.body)) {
        return res.status(400).send("Cant update: " + req.body)
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body,
            {new: true, runValidators: true})
        if (!user) {
            return res.status(404).send("User not Found")
        }
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

app.delete("/users/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndRemove(req.params.id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

app.post("/tasks", async (req, res) => {
    try {
        const task = new Task(req.body)
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

app.get("/tasks", async (req, res) => {
    try {
        const users = await Task.find({})
        res.status(200).send(users)
    } catch (e) {
        res.status(400).send(e)
    }
})


app.get("/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (!task) {
            return res.status(400).send()
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

app.patch("/tasks/:id", async (req, res) => {
    if (containsUnknownItems(Task, req.body)) {
        return res.status(400).send("Cant update: " + Object.keys(req.body))
    }
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body,
            {new: true, runValidators: true})
        if (!task) {
            return res.status(404).send()
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})


app.delete("/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndRemove(req.params.id)
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

function containsUnknownItems(object, body) {
    const updates = Object.keys(body)
    const allowedUpdates = Object.keys(object.schema.tree)
    return !updates.every((update) => allowedUpdates.includes(update))
}

app.listen(port, () => {
    console.log(" Server is up on port " + port)
})