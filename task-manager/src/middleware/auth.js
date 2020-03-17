const jwt = require("jsonwebtoken")
const User = require("../models/user")

const auth = async (req,res, next)=>{
    try {
        const token = req.get("authorization").replace("Bearer ", "")
        const decoded = jwt.verify(token, "secretstring")
        const user = await User.findOne({_id: decoded._id, "tokens.token": token})

        if(!user){
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    }catch (e) {
        console.log(e)
        res.status(404).send({error: "Please Authenticate"})
    }
}

module.exports = auth