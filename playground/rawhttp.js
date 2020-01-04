const https = require("https")

const url = `https://api.darksky.net/forecast/507974fb261c2a9e82cf5cf53eb4b050/40,-40`

const request = https.request(url, (response) =>{
    let data = ""
    response.on("data", (chunk)=>{
        data = data + chunk.toString()
    })

    response.on("end", ()=>{
        const body = JSON.parse(data)
        console.log(body)
    })
})

request.on("error", (error) => {
    console.log("an error", error)
})

request.end()
