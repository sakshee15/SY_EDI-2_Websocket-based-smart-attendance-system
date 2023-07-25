const mongoose = require("mongoose");
const { Schema } = mongoose;

const TeacherSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
   email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: Number,
    unique:true,
  },
  password: {
    type: String,
    required: true,
  },
  course_details:[{
      type: Schema.Types.ObjectId,
      ref:"course"
  }]
  
});

const User = mongoose.model('teacher', TeacherSchema);

module.exports = User;