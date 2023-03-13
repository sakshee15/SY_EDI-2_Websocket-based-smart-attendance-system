const Teacher = require('../models/teacher.model')
const Course = require('../models/course.model')
const Student = require('../models/student.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const generateToken = ({ userId }) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET);
    return token;
};

const teacherRegister = async (req, res) => {
    const { name, email, phoneNumber, password } = req.body;
    if (!name || !email || !phoneNumber || !password) {
        return res.status(404).json({ error: "Missing fields!!" })
    }

    try {
        const teach_email = await Teacher.findOne({ email: email })
        if (teach_email) {
            return res.status(400).json({ error: "Email already exists!" })
        }

        const teach_phone = await Teacher.findOne({ phoneNumber: phoneNumber })
        if (teach_phone) {
            return res.status(400).json({ error: "Phone number already exists!" })
        }

        const hashed_password = await bcrypt.hash(password, 10)
        const teacher = await Teacher.create({
            name: name,
            email: email,
            phoneNumber: phoneNumber,
            password: hashed_password
        })

        return res.status(200).json({ message: "User registered successfully" })

    } catch (err) {
        return res.status(500).json({ error: "Something went wrong" + err })
    }
}

const teacherLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Missing fields" })
    }
    try {
        const teacher = await Teacher.findOne({ email: email })
        if (!teacher) {
            return res.status(400).json({ error: "User not found ......... Invalid credentials" })
        }

        if (await bcrypt.compare(password, teacher.password)) {
            const authtoken = generateToken({
                userId: teacher._id,
            });
            return res
                .status(200)
                .json({ message: "Login Successfull!", authtoken: authtoken });
        } else {
            return res.status(400).json({ error: "Incorrect password" });
        }
    } catch (err) {
        return res.status(500).json({ error: "Something went wrong - " + err })
    }


}

const getTeacher = async (req, res) => {
    const userId = req.user.userId;
    // console.log("get userId", userId);
    const teacher = await Teacher.findOne({ _id: userId });
    if (!userId) {
        return res
            .status(400)
            .json({ error: "User not Authenticated!!" });
    }
    if (!teacher) {
        return res.status(400).json({ error: "User not found!" });
    }
    await Teacher.findOne({ _id: userId })
        .select("-password")
        .then((result) => {
            return res.status(200).json({ message: "Success", result });
        })
        .catch((err) => {
            return res
                .status(500)
                .json({ error: "Some error occurred!! - " + err.message });
        });
};

const updateTeacher = async (req, res) => {
    const userId = req.user.userId;
    const user = await Teacher.findOne({ _id: userId });
    if (!user) {
        return res.status(400).json({ error: "User not found!" });
    }
    const Id = req.params.id;
    const teacher = await Teacher.findOne({ _id: Id });
    if (!teacher) {
        return res.status(400).json({ error: "User not found!" });
    }
    if (user.email != teacher.email) {
        return res.status(400).json({ error: "Action not allowed" });
    }
    await Teacher.findOneAndUpdate(
        { _id: Id },
        {
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
        },
        { new: true }
    )
        .then((result) => {
            return res
                .status(200)
                .json({ message: "User updated Successfully" });
        })
        .catch((err) => {
            return res.status(500).json({ error: "Some error occurred! -  " + err });
        });
};

const deleteTeacher = async (req, res) => {
    const userId = req.user.userId;
    const user = await Teacher.findOne({ _id: userId });
    if (!user) {
        return res.status(400).json({ error: "User not found!!" });
    }
    const Id = req.params.id;
    const teacher = await Teacher.findOne({ _id: Id });
    if (!teacher) {
        return res.status(400).json({ error: "User not found!" });
    }
    if (user.email != teacher.email) {
        return res.status(401).json({ error: "Action not allowed!" });
    }
    await Teacher.deleteMany({ _id: Id })
        .then((result) =>
            res.status(200).json({ message: "Deleted successfully!", result })
        )
        .catch((err) =>
            res.status(500).json({ error: "Some error occured! - " + err })
        );
};

const getAllCourses = async (req, res) => {
    const userId = req.user.userId;
    if (!userId) {
        return res.status(404).json({ error: "User not authenticated!" });
    }

    const user = await Teacher.findOne({ _id: userId })
    if (!user) {
        return res.status(404).json({ error: "User not found!" });
    }

    try {
        const courses = await Course.find({ teacher_id: userId })
        console.log(courses);
        return res.status(200).json({ message: "Success!", courses: courses });
    } catch (err) {
        return res.status(500).json({ error: "Some error occurred" + err.message });
    }
}

const getCourseAttendance = async (req, res) => {
    const userId = req.user.userId;
    const courseId = req.params.id;
    if (!userId) {
        return res.status(404).json({ error: "User not authenticated!" });
    }
    try {
        const user = await Teacher.findOne({ _id: userId })
        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }
        const course = await Course.findOne({ _id: courseId })
        if(!course){
            return res.status(404).json({ error: "Course not found!"})
        }

        // // if(course.teacher_id !== user._id){
        //     return res.status(404).json({ error: "User cannot view the attendance for the course!" })
        // }

        const data = await Student.find({ "attendance.course_id": courseId })

        const attendance = data.map(function (a) {
            return {
                student_name: a.name,
                PRN: a.PRN_no,
                present_or_not: a.attendance.present_or_not,
                date: a.dateTime
            };
        });

        console.log(attendance);
        return res.status(200).json({
            message: "Success!",
            count: data.length,
            details: attendance,
        })
    } catch (err) {
        return res.status(500).json({ error: "Something went wrong" + err.message });
    }
}



module.exports = {
    teacherRegister,
    teacherLogin,
    getTeacher,
    updateTeacher,
    deleteTeacher,
    getAllCourses,
    getCourseAttendance
}