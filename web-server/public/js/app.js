const weatherForm = document.querySelector("form")
const search = document.querySelector("input")
const messageOne = document.querySelector("#message")
const messageTwo = document.querySelector("#message1")

weatherForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const location = search.value
    const url = `http://localhost:3000/weather?address=${location}`

    messageOne.textContent = (`Fetching ${location}...`)
    messageTwo.textContent = ("")

    fetch(url).then((res) => {
        res.json().then((data) => {
            if (data.error) {
                return messageOne.textContent = (data.error)
            }
            messageOne.textContent = (data.location)
            messageTwo.textContent = (data.forecast)
        })
    })
})


