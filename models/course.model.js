const mongoose = require("mongoose");
const { Schema } = mongoose;

const CourseSchema = new Schema({
  course_name: {
    type: String,
    required: true,
  },
  course_code:{
    type:String
  },
  teacher_id:{
    type: Schema.Types.ObjectId,
    required: true,
    ref:'teacher'
  },
});

const User = mongoose.model('course', CourseSchema);

module.exports = User;