const callback = (callback) => {
    setTimeout(()=>{
        callback("error", undefined)

    }, 2000)
}

callback((error, result)=>{
    if(error){
      return console.log(error)
    }
    return console.log(result)
})