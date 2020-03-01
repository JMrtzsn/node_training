const express = require("express")
const app = express()
const PORT = process.env.PORT || 3000;
const handler = require("./datastoreHandler")

app.get("/getCustomers", async (req, res) => {
    try {
        const users = await handler.getCustomers()
        if (!users) {
            return res.status(404).send()
        }
        res.send(users)
    } catch (e) {
        res.status(500).send(e)
    }
})

app.get("/getCustomers/:id", async (req, res) => {
    try {
        const user = await handler.getCustomerBy(req.params.id)
        if (!user) {
            return res.status(404)
        }
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})


app.listen(PORT, async () => {
    console.log(`App listening on port ${PORT}`);
});