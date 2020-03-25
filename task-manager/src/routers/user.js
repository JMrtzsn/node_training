const express = require("express")
const router = new express.Router()
const User = require("../models/user")
const containsUnknownItems = require("./utils")
const auth = require("../middleware/auth")
const multer = require("multer")
const sharp = require("sharp")
const {sendWelcomeEmail, sendGoodbyeEmail} = require("../emails/account")


router.post("/users", async (req, res) => {
    try {
        const user = new User(req.body)
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post("/users/logout", auth, async (req, res) => {
    try {
        //Create a new array of tokens without the one currently being used.
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send("Success")
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})


router.post("/users/logoutAll", auth, async (req, res) => {
    try {
        //Create a new array of tokens without the one currently being used.
        req.user.tokens = []
        await req.user.save()
        res.send("Successfully removed all tokens")
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})


//req tpath, middleware auth, response
router.get("/users/me", auth, async (req, res) => {
    try {
        console.log(req.user)
        res.send(req.user)
    } catch (e) {

    }
})


router.get("/users/:id", async (req, res) => {
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

router.patch("/users/me", auth, async (req, res) => {

    if (containsUnknownItems(User, req.body)) {
        return res.status(400).send("Cant update: " + req.body)
    }
    try {
        const updates = Object.keys(req.body)
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

router.delete("/users/me", auth, async (req, res) => {
    try {
        await req.user.remove()
        sendGoodbyeEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})


const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
            return cb(new Error("please upload an image"))
        }

        cb(undefined, true)
    }
})

router.post("/users/me/avatar", auth, upload.single("avatar"), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})


router.delete("/users/me/avatar", auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

// Get avatar for user
router.get("/users/:id/avatar", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set("Content-Type", "image/png")
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router