const { Router } = require('express')
const router = Router()
const {User, Course} = require('../database/database')
const userValidation = require('../middleware/userValidation')
const hash = require('../crypto')
const userMiddleware = require('../middleware/userMiddleware')
const {jwt_secret} = require('../config')
const jwt = require('jsonwebtoken')

router.post('/signup',userValidation,(req,res) =>  {
    const name = req.body.name;
    const userEmail = req.body.userEmail;
    const password = req.body.password;
    const hashedPassword = hash(password);
    const user = new User({
        name: name,
        userEmail: userEmail,
        password: hashedPassword
    })
    user.save();
    res.json({
        message: "User created Sucessfully"
    })
})

router.post('/signin',async(req,res) => {
    const userEmail = req.body.userEmail;
    const password = req.body.password;
    const hashedPassword = hash(password);
    const response = await User.findOne({
        userEmail: userEmail,
        password: hashedPassword
    })
    if(response){
        const tokenId = jwt.sign({
            userEmail: userEmail
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

router.get('/courses',async(req,res)=>{
    const response = await Course.find({});
    res.json({
        courses: response
    })
})

router.post('/courses/:courseId',userMiddleware,(req,res)=>{
    const courseId = req.params.courseId;
    const userEmail = req.userEmail;
    User.updateOne({
        userEmail: userEmail
    },
    {
        "$push":{
            purchasedCourses: courseId
        }
    }
).catch(function(err){
    console.log(err);
})
    res.json({
        message:"Course purchased successfully"
    })
})

router.get('/purchasedCourses',userMiddleware,async (req,res) => {
    const userEmail = req.userEmail;
    console.log(userEmail);
    const user = await User.findOne({
        userEmail: userEmail
    })
    const coursePurchased = user.purchasedCourses;
    const courses = await Course.findOne({
        _id: {
            "$in" : coursePurchased
        }
    })
    res.json({
        message: courses
    })
})

module.exports = router;