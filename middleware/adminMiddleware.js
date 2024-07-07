const jwt = require('jsonwebtoken')
const {jwt_secret} = require('../config')

function adminMiddleware(req,res,next){
    const token = req.headers.authorization;
    const tokenId = token.split(" ")[1]
    const response = jwt.verify(tokenId,jwt_secret)
    console.log(response);
    if(response.adminEmail){
        next();
    }
    else{
        res.status(403).json({
            messgae: "Admin not authenticated"
        })
    }
}

module.exports = adminMiddleware