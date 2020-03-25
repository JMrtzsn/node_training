const express = require("express")
const router = new express.Router()
const Task = require("../models/task")
const containsUnknownItems = require("./utils")
const auth = require("../middleware/auth")

router.post("/tasks", auth, async (req, res) => {
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

// Task, pagination, completed
// GET /tasks/completed=true - version path
// GET /tasks?limit=10&skip=10
// GET /tasks?sortBy=createAt_asc / desc
router.get("/tasks", auth, async (req, res) => {
    const match = {}
    const sort = {}
    if (req.query.completed) {
        match.completed = req.query.completed === "true"
    }
    if (req.query.sortBy){
        const parts = req.query.sortBy.split(":")
        sort[parts[0]] =  parts[1] === "desc" ? -1 : 1
    }
    try {
        await req.user.populate({
            path: "tasks",
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.status(200).send(req.user.tasks)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.get("/tasks/:id", auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({_id, owner: req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch("/tasks/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body)
    if (containsUnknownItems(Task, req.body)) {
        return res.status(400).send("Cant update: " + Object.keys(req.body))
    }
    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.status(200).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.delete("/tasks/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})

        if (!task) {
            return res.status(404).send()
        }
        res.status(200).send(task)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

module.exports = router

