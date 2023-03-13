const express = require('express');
const connectToMongoose = require('./database/db');
const app = express();
const teacherRoute = require('./routes/teacher.route')
const studentRoute = require('./routes/student.route')
const courseRoute = require('./routes/course.route')
require("dotenv").config({ path: "./.env" });
const PORT = process.env.PORT || 5000
connectToMongoose();
app.get('/', (req, res) => {
  res.send('Hello Server!');
});

app.use(express.json());
app.use('/teacher', teacherRoute);
app.use('/student', studentRoute);
app.use('/course', courseRoute);


app.listen(PORT, () => {
  console.log(`Server listening at port: ${PORT}`);
});


