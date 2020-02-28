const express = require("express")
const app = express()
const PORT = process.env.PORT || 3000;

app.get("/getCustomers", async (req, res) => {
    try {
         //TODO implement get id from DB /await User.findById(req.params.id)
        const users =  {"name": "Drmartin", "company": "secret"}
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
        //TODO implement get id from DB /await User.findById(req.params.id)
        const user =  {"name": "Drmartin", "company": "secret"}
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});