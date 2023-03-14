const express = require('express');
const studentRoute = express.Router();
const {StudentLogin,getStudent,updateStudent,deleteStudent, getCoursesEnrolled,getCourseAttendance,registerCourse, studentRegister,processMessage} = require('../controllers/student.controller');
const fetchuser = require("../middlewares/fetchuser.middleware");


studentRoute.post('/register', studentRegister)
studentRoute.post('/login',StudentLogin);
studentRoute.get('/get',fetchuser,getStudent);
studentRoute.put('/update/:id',fetchuser,updateStudent);
studentRoute.delete('/delete/:id',fetchuser,deleteStudent);
studentRoute.get('/getCourse',fetchuser,getCoursesEnrolled);
studentRoute.get('/getCourseAttendance',fetchuser,getCourseAttendance)
studentRoute.post('/registerCourse',fetchuser,registerCourse)
studentRoute.post('/processMessage/:id/:data',processMessage)

module.exports = studentRoute;