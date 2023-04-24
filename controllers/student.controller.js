const Teacher = require('../models/teacher.model')
const Course = require('../models/course.model')
const Student = require('../models/student.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const moment = require('moment-timezone');
const mongoose = require('mongoose')

const generateToken = ({ userId }) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET);
    return token;
};

const studentRegister = async (req, res) => {
    const { name, email, phoneNumber, PRN_no, fingerPrint_id } = req.body;
    if (!name || !email || !phoneNumber || !PRN_no || !fingerPrint_id) {
        return res.status(404).json({ error: "Missing fields!!" })
    }

    try {
        const stud_email = await Student.findOne({ email: email })
        if (stud_email) {
            return res.status(400).json({ error: "Email already exists!" })
        }

        const stud_phone = await Student.findOne({ phoneNumber: phoneNumber })
        if (stud_phone) {
            return res.status(400).json({ error: "Phone number already exists!" })
        }
        const str = PRN_no.toString()
        const hashed_password = await bcrypt.hash(str, 10)
        const student = await Student.create({
            name: name,
            email: email,
            phoneNumber: phoneNumber,
            PRN_no: PRN_no,
            password: hashed_password,
            FingerPrint_ID: fingerPrint_id
        })

        student.courses_enrolled.push('640e8834c4298bbd1fc89229', '640e8841c4298bbd1fc8922c', '640e884bc4298bbd1fc8922f');
        student.save();
        // student.courses_enrolled.push('640e8841c4298bbd1fc8922c');
        // student.save();
        // student.courses_enrolled.push('640e884bc4298bbd1fc8922f');
        //student.save();
        return res.status(200).json({ message: "User registered successfully" })

    } catch (err) {
        return res.status(500).json({ error: "Something went wrong" + err })
    }
}

const StudentLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Missing fields" })
    }
    try {
        const student = await Student.findOne({ email: email })
        if (!student) {
            return res.status(400).json({ error: "User not found ......... Invalid credentials" })
        }

        if (await bcrypt.compare(password, student.password)) {
            const authtoken = generateToken({
                userId: student._id,
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

const getStudent = async (req, res) => {
    const userId = req.user.userId;
    // console.log("get userId", userId);
    const student = await Student.findOne({ _id: userId });
    if (!userId) {
        return res
            .status(400)
            .json({ error: "User not Authenticated!!" });
    }
    if (!student) {
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

const updateStudent = async (req, res) => {
    const userId = req.user.userId;
    const user = await Student.findOne({ _id: userId });
    if (!user) {
        return res.status(400).json({ error: "User not found!" });
    }
    const Id = req.params.id;
    const student = await Student.findOne({ _id: Id });
    if (!student) {
        return res.status(400).json({ error: "User not found!" });
    }
    if (user.email != student.email) {
        return res.status(400).json({ error: "Action not allowed" });
    }
    await Student.findOneAndUpdate(
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

const deleteStudent = async (req, res) => {
    const userId = req.user.userId;
    const user = await Student.findOne({ _id: userId });
    if (!user) {
        return res.status(400).json({ error: "User not found!!" });
    }
    const Id = req.params.id;
    const student = await Student.findOne({ _id: Id });
    if (!student) {
        return res.status(400).json({ error: "User not found!" });
    }
    if (user.email != student.email) {
        return res.status(401).json({ error: "Action not allowed!" });
    }
    await Student.deleteMany({ _id: Id })
        .then((result) =>
            res.status(200).json({ message: "Deleted successfully!", result })
        )
        .catch((err) =>
            res.status(500).json({ error: "Some error occured! - " + err })
        );
};

const getCourses= async (req, res) => {
    const userId = req.user.userId;
    if (!userId) {
        return res.status(404).json({ error: "User not authenticated!" });
    }
    try {
        const user = await Student.findOne({ _id: userId }).select("courses_enrolled -_id") .populate('courses_enrolled')
   
//.populate({ path: 'courses_enrolled.course_id', select: "course_name -_id" })
        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        // const courses = [];
        // user.courses_enrolled.forEach(enrollment => {
        //     await Courses.fi
        //     courses.push(enrollment.course_id.course_name);
        // });

        // const coursesEnrolled = user.courses_enrolled.map(async (course) => (
        //     let course_name =  await Course.findOne({_id:course})
        //     //console.log(await Course.findOne({_id:course})),{
        //   //  console.log(course.course_id, course),
        //     courseName: await Course.findOne({_id:course})
        // }));


        return res.status(200).json({ message: "Success", data: user });

    } catch (err) {
        return res.status(500).json({ error: "Some error occurred  " + err.message });
    }
}

const getCourseAttendance = async (req, res) => {
    const userId = req.user.userId;
    const courseName = req.params.name
    if (!userId) {
        return res.status(404).json({ error: "User not authenticated" });
    }
    try {
        const course = await Course.findOne({ course_name: courseName });
        if (!course) {
            return res.status(404).json({ error: "Course not found" })
        }
       
        const attendance = await Student.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(userId) } },
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
                present_or_not: {
                    $cond: {
                        if: { $eq: ["$attendance.present_or_not", 1] },
                        then: "Present",
                        else: "Absent",
                    },
                },
                date: { $dateToString: { format: "%d-%m-%Y %H:%M:%S", date: "$attendance.dateTime" } }
            }}
          ]);
          
          return res.status(200).json({
            message: "Success!",
            count: attendance.length,
            details: attendance,
          });

    } catch (err) {
        return res.status(500).json({ error: "Some error occurred" + err.message });
    }
}

const registerCourse = async (req, res) => {
    const userId = req.user.userId
    const courseId = req.params.id;
    if (!userId) {
        return res.status(404).json({ error: "User not authenticated" })
    }
    try {
        const user = await Student.findOne({ _id: userId })
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        user.courses_enrolled.push(courseId);
        user.save();
        return res.status(200).json({ message: "Course added successfully" })
    } catch (err) {
        return res.status(500).json({ error: "Some error occurred" + err.message })
    }
}

const processMessage = async (req, res) => {
    try {
        const courseId = req.params.id
        const data = req.params.data
        const now = moment().tz("Asia/Kolkata");
        // Create a new Date object with UTC timezone
        const utcDateTime = new Date();
        utcDateTime.setUTCDate(now.date());
        utcDateTime.setUTCMonth(now.month());
        utcDateTime.setUTCFullYear(now.year());
        // Set the hours, minutes, seconds, and milliseconds of the date object
        utcDateTime.setUTCHours(now.hours());
        utcDateTime.setUTCMinutes(now.minutes());
        utcDateTime.setUTCSeconds(now.seconds());
        utcDateTime.setUTCMilliseconds(now.milliseconds());

        console.log(utcDateTime)

        const user = await Student.findOne({ FingerPrint_ID: data });
        // console.log(user, "User found")
        if (!user) {
            return res.send("User not found!!")
            //return res.status(200).json({message:"User registered with the website"})
        }

        const result = await Student.findByIdAndUpdate({ _id: user._id }, {
            $push: {
                attendance: {
                    course_id: courseId,
                    dateTime: utcDateTime,
                    present_or_not: 1,
                },
            }
        }, { new: true })
        return res.status(200).send("Attendance of for IOT theory is marked ")

    } catch (err) {
        return res.status(500).send("Something wrong occured")// rejecting the Promise with the error
    }
}


module.exports = {
    studentRegister,
    StudentLogin,
    getStudent,
    updateStudent,
    deleteStudent,
    getCourses,
    getCourseAttendance,
    registerCourse,
    processMessage

}