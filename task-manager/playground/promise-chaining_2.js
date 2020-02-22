require("../src/db/mongoose")
const Task = require("../src/models/task")
/*

Task.findByIdAndRemove("5e19c4b5ae1e0a1dd612732b").then((task)=>{
    console.log(task)
    return Task.countDocuments({completed:false})
}).then((r)=>{
    console.log(r)
}).catch((e)=>{
    console.log(e)
})
*/

const deleteTaskAndCount = async (id, task) => {
    await Task.findByIdAndRemove(id)
    const count = await Task.countDocuments()
    return count
}

deleteTaskAndCount("5e19c4b5ae1e0a1dd612732b",).then((count) => {
    console.log(count)
}).catch((err)=>{
    console.log(err)
})