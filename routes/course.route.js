const express = require('express');
const courseRoute = express.Router();
const {courseRegister,getCourse,updateCourse,deleteCourse} = require('../controllers/course.controller');
const fetchuser = require("../middlewares/fetchuser.middleware");




courseRoute.post('/register',fetchuser,courseRegister);
courseRoute.get('/get/:id',fetchuser,getCourse);
courseRoute.put('/update/:id',fetchuser,updateCourse);
courseRoute.delete('/delete/:id',fetchuser,deleteCourse);




module.exports = courseRoute;