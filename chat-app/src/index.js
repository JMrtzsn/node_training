const path = require('path')
const http = require("http")
const express = require('express')
const socketio = require("socket.io")
const badWords = require("bad-words")
const {generateMessage} = require("./utils/messages")
const {addUser, getUser, getUsersInRoom, removeUser} = require("./user")

const app = express()
const server = http.createServer(app)
// SocketIO needs the raw httpServer object, not the app
// Adding socketio adds a new public file to the server (see index.html)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


// Connection is a "hard" typed event
io.on("connection", (socket) => {
    console.log("New socket connection")

    socket.on("join", ({username, room}, callback) => {
        const {error, user} = addUser({id: socket.id, username, room})

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit("message", generateMessage("Admin", "Welcome"))
        socket.broadcast.to(user.room).emit("message", generateMessage(user.username, `${user.username} has joined the room`))

        io.to(user.room).emit("roomData", {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on("newMessage", (message, callback) => {
        const user = getUser(socket.id)
        const filter = new badWords()
        if (filter.isProfane(message)) {
            return callback("Profanity is not allowed")
        } else {
            io.to(user.room).emit("message", generateMessage(user.username, message))
            callback()
        }
    })

    socket.on("newLocation", (location, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit("locationMessage", generateMessage(user.username, `https://google.com/maps?q=${location.latitude},${location.longitude}`))

        callback()
    })

    socket.on("disconnect", () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit("message", generateMessage("Admin", "User has disconnected"))
            io.to(user.room).emit("roomData", {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }

    })

})


server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})