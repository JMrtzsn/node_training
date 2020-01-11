const promise = new Promise((resolve,reject) => {
    setTimeout(()=>{
        //resolve("Works")

        reject("No Works")
    }, 2000)
})


promise.then((result)=>{
    console.log("Success", result)
}).catch((reject)=>{
    console.log("Fail", reject)
})