const jwt = require('jsonwebtoken')
const {jwt_secret} = require('../config')

function userMiddleware(req,res,next){
    const token = req.headers.authorization;
    const tokenId = token.split(" ")[1]
    const response = jwt.verify(tokenId,jwt_secret)
    if(response.userEmail){
        req.userEmail = response.userEmail
        next();
    }
    else{
        res.status(403).json({
            messgae: "User not authenticated"
        })
    }
}

module.exports = userMiddleware