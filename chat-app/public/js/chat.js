const socket = io()


// Elements
const $messageForm = document.querySelector("#chat")
const $messageFormInput = $messageForm.querySelector("input")
const $messageFormButton = $messageForm.querySelector("button")
const $shareLocationButton = document.querySelector("#share-location")
const $messages = document.querySelector("#messages")
const $sidebar = document.querySelector("#sidebar")

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML
const locationTemplate = document.querySelector("#location-template").innerHTML
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML

// Options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})
const autoscroll = () => {
    const $newMessage = $messages.lastElementChild
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    const visibleHeight = $messages.offsetHeight
    const containerHeight = $messages.scrollHeight

    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on("message", (message) => {
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format("HH:mm")
    })
    $messages.insertAdjacentHTML("beforeend", html)
    autoscroll()
})


socket.on("locationMessage", (location) => {
    const html = Mustache.render(locationTemplate, {
        username: location.username,
        location: location.text,
        createdAt: moment(location.createdAt).format("HH:mm")
    })
    $messages.insertAdjacentHTML("beforeend", html)
    autoscroll()
})

socket.on("roomData", ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users,
    })
    $sidebar.innerHTML = html
    console.log(room)
})

$messageForm.addEventListener("submit", (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute("disabled", "disabled")
    const message = e.target.elements.message.value

    socket.emit("newMessage", message, (error) => {
        $messageFormButton.removeAttribute("disabled")
        $messageFormInput.value = ""
        $messageFormInput.focus()
        if (error) {
            return console.log(error)
        }

        console.log("Message delivered")
    })
})


$shareLocationButton.addEventListener("click", () => {
    if (!navigator.geolocation) {
        return alert("Upgrade your browser")
    }

    $shareLocationButton.setAttribute("disabled", "disabled")
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit("newLocation",
            {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }, () => {
                console.log("Location shared")
                $shareLocationButton.removeAttribute("disabled")
            })
    })
})


socket.emit("join", {username, room}, (error) => {
    if (error) {
        alert(error)
        location.href = "/"
    }

})