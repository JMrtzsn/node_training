const express = require("express")
const router = new express.Router()
const Task = require("../models/task")
const containsUnknownItems = require("./utils")
const auth = require("../middleware/auth")

router.post("/tasks",auth, async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            owner: req.user._id
        })
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get("/tasks",auth, async (req, res) => {
    try {
        const users = await Task.find({})
        res.status(200).send(users)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.get("/tasks/:id", async (req, res) => {
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

router.patch("/tasks/:id", async (req, res) => {
    if (containsUnknownItems(Task, req.body)) {
        return res.status(400).send("Cant update: " + Object.keys(req.body))
    }
    try {

        const task = await Task.findById(req.params.id)
        if (!task) {
            return res.status(404).send()
        }

        const updates = Object.keys(req.body)
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.status(200).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.delete("/tasks/:id", async (req, res) => {
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

module.exports = router

