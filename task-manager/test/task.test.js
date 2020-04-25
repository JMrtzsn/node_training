const request = require("supertest")
const app = require("../src/app")
const Task = require("../src/models/task")
const {testUser, testUser2,taskOne, setupDB} = require("./fixtures/db")


beforeEach(async () => {
    await setupDB()
})

test("Should create task for user", async () =>{
    const response = await request(app).post("/tasks")
        .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
        .send({
            description: "Test Task",
        })
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
})

test("Should get tasks for user", async () =>{
    const response = await request(app).get("/tasks")
        .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toEqual(2)
})


test("Should not delete tasks for other user", async () =>{
    const response = await request(app).delete(`/tasks/${taskOne._id}`)
        .set("Authorization", `Bearer ${testUser2.tokens[0].token}`)
        .send()
        .expect(404)
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()

})


test("Should delete tasks for other user", async () =>{
    const response = await request(app).delete(`/tasks/${taskOne._id}`)
        .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)
    const task = await Task.findById(taskOne._id)
    expect(task).toBeNull()

})