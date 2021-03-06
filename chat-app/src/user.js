const users = []

const addUser = ({id, username, room}) => {


    room = room.trim().toLocaleLowerCase()
    username = username.trim().toLocaleLowerCase()

    if (!room || !username) {
        return {
            error: "Proper Username and Room required"
        }
    }


    const existingUser = users.find((user) => {
        return user.room === room && user.username == username
    })

    if (existingUser) {
        return {
            error: "Username invalid"
        }
    }

    const user = {id, username, room}
    users.push(user)
    return {user}
}


const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    const usersInRoom =  users.filter((user) => user.room === room)
    return usersInRoom
}

module.exports = {
    addUser,
    removeUser,
    getUsersInRoom,
    getUser,
}