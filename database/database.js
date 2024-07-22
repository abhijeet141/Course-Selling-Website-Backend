const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://admin:rohit264eden@cluster0.p3o99vc.mongodb.net/courseSellingApplication')

const AdminSchema = new mongoose.Schema({
    name: String,
    adminEmail: String,
    password: String
})

const UserSchema = new mongoose.Schema({
    name: String,
    userEmail: String,
    password: String,
    purchasedCourses:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
})

const CourseSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    imageLink: String
})

const Admin = mongoose.model('Admin', AdminSchema)
const User = mongoose.model('User', UserSchema)
const Course = mongoose.model('Course', CourseSchema)

module.exports = {
    Admin,
    User,
    Course
}