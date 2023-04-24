const express = require('express');
const studentRoute = express.Router();
const {StudentLogin,getStudent,updateStudent,deleteStudent, getCourses,getCourseAttendance,registerCourse, studentRegister,processMessage} = require('../controllers/student.controller');
const fetchuser = require("../middlewares/fetchuser.middleware");


studentRoute.post('/register', studentRegister)
studentRoute.post('/login',StudentLogin);
studentRoute.get('/get',fetchuser,getStudent);
studentRoute.put('/update/:id',fetchuser,updateStudent);
studentRoute.delete('/delete/:id',fetchuser,deleteStudent);
studentRoute.get('/getCourse',fetchuser,getCourses);
studentRoute.get('/getCourseAttendance/:name',fetchuser,getCourseAttendance)
studentRoute.post('/registerCourse',fetchuser,registerCourse)
studentRoute.post('/processMessage/:id/:data',processMessage)

module.exports = studentRoute;