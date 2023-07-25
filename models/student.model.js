const mongoose = require("mongoose");
const { Schema } = mongoose;

const StudentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  PRN_no: {
    type: Number,
  },
  phoneNumber: {
    type: Number,
    unique: true,
  },
  password: {
    type: String,
    //required: true,
  },
  graduation_year: {
    type: Number
  },
  FingerPrint_ID: {
    type: String,
  },
  courses_enrolled: [{
    type: Schema.Types.ObjectId,
    ref: 'course'
  }],
  attendance: [{
    course_id: {
      type: Schema.Types.ObjectId,
      ref: "course"
    },
    dateTime: {
      type: Date
    },
    present_or_not: {
      type: Number,     // 0 - absent, 1 - present
      default: 0
    }
  }]
});

const Student = mongoose.model('student', StudentSchema);

module.exports = Student;