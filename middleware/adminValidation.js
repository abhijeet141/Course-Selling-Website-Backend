const zod = require('zod')
const { Admin } = require('../database/database')

const schema = zod.object({
    name: zod.string(),
    adminEmail: zod.string().email(),
    password: zod.string().min(8).max(32)
})

async function adminValidation(req,res,next){
    const admin = req.body;
    const response = schema.safeParse(admin);
    console.log(response);
    if(!response.success){
        res.status(404).json({
            message: "Input is Invalid"
        })
    }
    else {
        const existingUser = await Admin.findOne({
            adminEmail: admin.adminEmail
        })
        if(existingUser){
            res.status(404).json({
                message: "Admin already exists please LogIn"
            })
        }
        else{
            next();
        }
    }
}

module.exports = adminValidation;