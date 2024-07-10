const { Router } = require('express');
const { Admin, Course } = require('../database/database');
const adminValidation = require('../middleware/adminValidation')
const hash = require('../crypto')
const router = Router();
const {jwt_secret} = require('../config')
const jwt = require('jsonwebtoken')
const adminMiddleware = require('../middleware/adminMiddleware')

router.post('/signup', adminValidation, (req, res) => {
    const name = req.body.name;
    const adminEmail = req.body.adminEmail;
    const password = req.body.password;
    const hashedPassword = hash(password);
    const adminUser = new Admin({
        name: name,
        adminEmail: adminEmail,
        password: hashedPassword
    })
    adminUser.save();
    res.json({
        message: "Admin created Sucessfully"
    })
})

router.post('/signin', async(req,res) => {
    const adminEmail = req.body.adminEmail;
    const password = req.body.password;
    const hashedPassword = hash(password);
    console.log(hashedPassword);
    const response = await Admin.findOne({
        adminEmail: adminEmail,
        password: hashedPassword
    })
    console.log(response);
    if(response){
        const tokenId = jwt.sign({
            adminEmail: adminEmail
        },jwt_secret)
        res.json({
            tokenId
        })
    }
    else{
        res.status(403).json({
            message: "Wrong Email or Password"
        })
    }
})

router.post('/courses',adminMiddleware,(req,res) => {
    const title = req.body.title;
    const description = req.body.description
    const price = req.body.price
    const imageLink = req.body.imageLink
    const course = new Course({
        title: title,
        description: description,
        price: price,
        imageLink: imageLink
    })
    course.save();
    res.json({message: "Course created sucessfully by Admin",
        courseId: course._id
    })
})

router.get('/courses',adminMiddleware,async(req,res)=>{
    const response = await Course.find({})
    res.json({
        courses: response
    })
})

module.exports = router;