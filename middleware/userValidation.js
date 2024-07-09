const zod = require('zod')
const { User } = require('../database/database')

const schema = zod.object({
    name: zod.string(),
    userEmail: zod.string().email(),
    password: zod.string().min(8).max(32)
})

async function userValidation(req,res,next){
    const user = req.body;
    const response = schema.safeParse(user);
    console.log(response);
    if(!response.success){
        res.status(404).json({
            message: "Input is Invalid"
        })
    }
    else {
        const existingUser = await User.findOne({
            userEmail: user.userEmail
        })
        if(existingUser){
            res.status(404).json({
                message: "User already exists please LogIn"
            })
        }
        else{
            next();
        }
    }
}

module.exports = userValidation;