
const add = (a, b) => {
    return new Promise(((resolve, reject) => {
        setTimeout(() => {
            resolve(a + b)
        }, 2000)
    }))
}

const doWork = async () => {
    // Async functions always return a promise
    const value = await add(1,2)
    return value
}

doWork().then((result) => {
    //Fulfill value
    console.log(result)
})
