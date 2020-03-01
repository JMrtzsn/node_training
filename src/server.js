const express = require("express")
const app = express()
const PORT = process.env.PORT || 3000;
const handler = require("./datastoreHandler")


app.get("/generateCustomers", async (req, res)=>{
     try {
        await handler.generateCustomers()
        res.status(201).send("Successfully generated 10 customers!")
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

app.get("/getCustomers", async (req, res) => {
    try {
        const users = await handler.listCustomers()
        if (!users) {
            return res.status(404).send()
        }
        res.send(users)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

app.get("/getCustomers/:id", async (req, res) => {
    try {
        const user = await handler.getCustomer(req.params.id)
        console.log(user)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})


app.listen(PORT, async () => {
    console.log(`App listening on port ${PORT}`);
});