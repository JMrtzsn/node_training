const request = require("supertest")
const app = require("../src/app")
const User = require("../src/models/user")
const {testUser, testUserId, setupDB} = require("./fixtures/db")


beforeEach(async () => {
    await setupDB()
})


test("Should signup a new user", async () => {
    const response = await request(app).post("/users").send({
        name: "test Testson",
        email: "test@test.com",
        password: "TestPass1262!"
    }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: "test Testson",
            email: "test@test.com"
        },
        token: user.tokens[0].token
    })
})

test("Should login user", async () => {
    const response = await request(app).post("/users/login").send({
        email: testUser.email,
        password: testUser.password
    }).expect(200)
    // Assert User is logged in
    const user = await User.findById(response.body.user._id)
    expect(user.tokens[1].token).toMatch(response.body.token)
})

test("Should Login fail", async () => {
    await request(app).post("/users/login").send({
        email: "FAIL",
        password: "nah"
    }).expect(400)
})

test("Should get user profile", async () => {
    await request(app).get("/users/me")
        .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)
})

test("Should not get profile", async () => {
    await request(app)
        .get("/users/me")
        .send()
        .expect(401)
})

test("Should delete for account", async () => {
    await request(app).delete("/users/me")
        .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)


    const user = await User.findById(testUserId)
    expect(user).toBeNull()
})


test("Should fail delete for account", async () => {
    await request(app).delete("/users/me")
        .send()
        .expect(401)
})

test("Should upload avatar image", async ()=>{
    await request(app).post("/users/me/avatar")
        .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
        .attach("avatar","/Users/j-mac/Work/node_training/task-manager/test/fixtures/profile-pic.jpg")
        .expect(200)


    const user = await User.findById(testUserId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test("Should update User fields", async ()=>{
    const response = await request(app).patch("/users/me")
        .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
        .send({"name": "newName"})
        .expect(200)

    const user = await User.findById(testUserId)
    expect(user.name).toBe("newName")
})

test("Should not update invalid User fields", async ()=>{
    const response = await request(app).patch("/users/me")
        .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
        .send({"location": "newlocation"})
        .expect(400)
})