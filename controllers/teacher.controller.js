const Teacher = require('../models/teacher.model')
const Course = require('../models/course.model')
const Student = require('../models/student.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

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
    const courseName = req.params.name
    if (!userId) {
        return res.status(404).json({ error: "User not authenticated!" });
    }
    try {
        
        const user = await Teacher.findOne({ _id: userId })
        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        const course = await Course.findOne({course_name: courseName })
        if(!course){
            return res.status(404).json({ error: "Course not found!"})
        }

        const attendance = await Student.aggregate([
            // Join the Student and Course collections on the course_id field
            { $lookup: {
                from: "courses",
                localField: "attendance.course_id",
                foreignField: "_id",
                as: "course"
            }},
            // Filter the attendance records by course ID
            { $match: { "course._id": new mongoose.Types.ObjectId(course._id) }},
            // Flatten the attendance array to return one document per attendance record
            { $unwind: "$attendance" },
            // Filter out attendance records that don't match the course ID
            { $match: { "attendance.course_id": new mongoose.Types.ObjectId(course._id) }},
            // Project the desired fields for the attendance record
            { $project: {
                _id: 0,
                student_name: "$name",
                PRN: "$PRN_no",
                present_or_not:{ $cond: {
                    if: { $eq: ["$attendance.present_or_not", 1] },
                    then: "Present",
                    else: "Absent",
                },
            },
                date: { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$attendance.dateTime" } }
            }}
          ]);
          
          return res.status(200).json({
            message: "Success!",
            count: attendance.length,
            details: attendance,
          });
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