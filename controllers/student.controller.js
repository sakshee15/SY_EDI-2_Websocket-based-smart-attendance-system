const Teacher = require('../models/teacher.model')
const Course = require('../models/course.model')
const Student = require('../models/student.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const generateToken = ({ userId }) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET);
    return token;
};

const studentRegister = async (req, res) => {
    const { name, email, phoneNumber, PRN_no,fingerPrint_id} = req.body;
    if (!name || !email || !phoneNumber || !PRN_no ||!fingerPrint_id) {
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

        student.courses_enrolled.push('640e8834c4298bbd1fc89229','640e8841c4298bbd1fc8922c','640e884bc4298bbd1fc8922f');
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
        return res.status(400).json({error:"User not found!!"});
    }
    const Id = req.params.id;
    const student = await Student.findOne({ _id: Id });
    if (!student) {
        return res.status(400).json({error:"User not found!"});
    }
    if (user.email != student.email) {
        return res.status(401).json({error: "Action not allowed!"});
    }
    await Student.deleteMany({ _id: Id })
        .then((result) =>
            res.status(200).json({message:"Deleted successfully!", result})
        )
        .catch((err) =>
            res.status(500).json({error: "Some error occured! - "+ err})
        );
};

const getCoursesEnrolled = async (req, res) =>{
    const userId = req.user.userId;
    if(!userId){
        return res.status(404).json({error: "User not authenticated!"});
    }
    try{
        const user  = await Student.findOne({_id: userId}).populate('courses_enrolled.courseId');;
        if(!user){
            return res.status(404).json({error: "User not found!"});
        }
         
        return res.status(200).json({message:"Success",data:user.courses_enrolled});

    }catch(err){
        return res.status(500).json({error:"Some error occurred" + err.message});
    }
}

const getCourseAttendance = async(req, res) => {
    const userId = req.user.userId;
    const courseId = req.params.id
    if(!userId) {
        return res.status(404).json({error:"User not authenticated"});
    }
    try{
        const course = await Course.findOne({_id: courseId});
        if(!course){
            return res.status(404).json({error:"Course not found"})
        }
        const user  = await Student.find({_id:userId},{"attendance.course_id":courseId});
        if(!user){
            return res.status(404).json({error:"User not found"});
        }
        console.log(user);
        return res.status(200).json({message:"Success",data:user })
        
    }catch(err){
        return res.status(500).json({error:"Some error occurred" + err.message});
    }
}

const registerCourse = async(req,res) => {
    const userId = req.user.userId
    const courseId = req.params.id;
    if(!userId){
         return res.status(404).json({error:"User not authenticated"})
    }
    try{
    const user = await Student.findOne({_id: userId})
    if(!user){
        return res.status(404).json({error:"User not found"})
    }
    user.courses_enrolled.push(courseId);
    user.save();
    return res.status(200).json({message: "Course added successfully"})
}catch(err){
    return res.status(500).json({error:"Some error occurred" + err.message})
}
}

const processMessage = async(req,res) => {
      try {
        const courseId = req.params.id
        const data = req.params.data
        const now = new Date()
        const user = await Student.findOne({ FingerPrint_ID: data });
        // console.log(user, "User found")
        if (!user) {
          return res.send("User not found!!")
          //return res.status(200).json({message:"User registered with the website"})
        }
        console.log("User recieved message")
        const result = await Student.findByIdAndUpdate({ _id: user._id }, {
          $push: {
            attendance: {
              course_id: courseId,
              dateTime:Date.now(),
              present_or_not: 1,
            },
          }
        }, { new: true })
        console.log("error")
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
    getCoursesEnrolled,
    getCourseAttendance,
    registerCourse,
    processMessage

}