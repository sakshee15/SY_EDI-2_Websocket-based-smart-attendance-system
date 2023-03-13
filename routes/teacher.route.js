const express = require('express');
const teacherRoute = express.Router();
const { teacherRegister, teacherLogin, getTeacher, updateTeacher, deleteTeacher, getAllCourses, getCourseAttendance } = require('../controllers/teacher.controller');
const fetchuser = require("../middlewares/fetchuser.middleware");



teacherRoute.post('/register', teacherRegister);
teacherRoute.post('/login', teacherLogin);
teacherRoute.get('/get', fetchuser, getTeacher);
teacherRoute.put('/update/:id', fetchuser, updateTeacher);
teacherRoute.delete('/delete/:id', fetchuser, deleteTeacher);
teacherRoute.get('/getCourses', fetchuser, getAllCourses);
teacherRoute.get('/getCourseAttendance/:id', fetchuser, getCourseAttendance);

module.exports = teacherRoute;