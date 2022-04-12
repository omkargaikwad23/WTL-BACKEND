const jwt = require('jsonwebtoken')
const Farmer = require('../models/Farmer')

const farmerAuth = async (req , res , next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token , process.env.JWT_SECRET)
        const farmer = await Farmer.findOne({_id : decode._id, 'tokens.token' : token})
        if (!farmer){
            throw new Error()
        }
        req.farmer = farmer
        req.token =token
        next()

    } catch(e){
        res.status(401).send({error : "Not authenticated"})
    }

}
module.exports = farmerAuth