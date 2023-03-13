const Teacher = require('../models/teacher.model')
const Course = require('../models/course.model')

const courseRegister = async (req, res) => {
    const { name, code } = req.body;
    const teacherId = req.user.userId
    if (!name || !code) {
        return res.status(404).json({ error: "Missing fields!!" })
    }

    try {
        if (!teacherId) {
            return res.status(404).json({ error: "User not authenticated!" })
        }
        const teacher = await Teacher.findOne({ _id: teacherId })
        if (!teacher) {
            return res.status(400).json({ error: "User not found!" })
        }

        const course = await Course.create({
            course_name: name,
            course_code: code,
            teacher_id: teacherId
        })

        return res.status(200).json({ message: "Course registered successfully" })

    } catch (err) {
        return res.status(500).json({ error: "Something went wrong" + err })
    }
}

const getCourse = async (req, res) => {
    const userId = req.user.userId;
    if (!userId) {
        return res
            .status(400)
            .json({ error: "User not Authenticated!!" });
    }
    const courseId = req.params.id;
    if (!courseId) {
        return res.status(400).json({ error: "Missing fields!" });
    }
    const teacher = await Teacher.findOne({ _id: userId });


    if (!teacher) {
        return res.status(400).json({ error: "User not found!" });
    }
    const course = await Course.findOne({ _id: courseId })
        .then((result) => {
            return res.status(200).json({ message: "Success", result });
        })
        .catch((err) => {
            return res
                .status(500)
                .json({ error: "Some error occurred!! - " + err.message });
        });
};

const updateCourse = async (req, res) => {
    const { name, code } = req.body
    const teacherId = req.user.userId;
    try {
        const teacher = await Teacher.findOne({ _id: teacherId });
        if (!teacher) {
            return res.status(400).json({ error: "User not found!" });
        }
        const courseId = req.params.id;
        const course = await Course.findOne({ _id: courseId });
        if (!course) {
            return res.status(400).json({ error: "Course not found!" });
        }
        if (teacher._id != course.teacher_id) {
            return res.status(400).json({ error: "Action not allowed" });
        }
        const updateCourse = {
            name: name,
            code: code
        }
        await Course.findOneAndUpdate(
            { _id: courseId },
            {
                $set: updateCourse
            },
            { new: true }
        )
            .then((result) => {
                return res
                    .status(200)
                    .json({ message: "Course updated Successfully" });
            })
            .catch((err) => {
                return res.status(500).json({ error: "Some error occurred! -  " + err });
            });
    } catch (err) {
        return res.status(500).json({ error: "Some error occurred! - " + err });
    }
};

const deleteCourse = async (req, res) => {
    const teacherId = req.user.userId;
    try {
        const teacher = await Teacher.findOne({ _id: teacherId });
        if (!teacher) {
            return res.status(400).json({ error: "User not found!!" });
        }
        const courseId = req.params.id;
        const course = await Course.findOne({ _id: courseId });
        if (!course) {
            return res.status(400).json({ error: "Course not found!" });
        }
        if (teacher._id != course.teacher_id) {
            return res.status(401).json({ error: "Action not allowed!" });
        }
        await Course.deleteMany({ _id: courseId })
            .then((result) =>
                res.status(200).json({ message: "Deleted successfully!", result })
            )
            .catch((err) =>
                res.status(500).json({ error: "Some error occured! - " + err })
            );
    } catch (err) {
        return res.status(500).json({ error: "Some error occured! - " + err })
    }
};




module.exports = {
    courseRegister,
    getCourse,
    updateCourse,
    deleteCourse
}