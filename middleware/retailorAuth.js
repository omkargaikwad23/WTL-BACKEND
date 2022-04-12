const jwt = require('jsonwebtoken')
const Retailor = require('../models/Retailor')

const retailorAuth = async (req , res , next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token , process.env.JWT_SECRET)
        const retailor = await Retailor.findOne({_id : decode._id, 'tokens.token' : token})
        if (!retailor){
            throw new Error()
        }
        req.retailor = retailor
        req.token =token
        next()

    } catch(e){
        res.status(401).send({error : "Not authenticated"})
    }
}
module.exports = retailorAuth