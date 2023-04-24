const express = require('express');
const connectToMongoose = require('./database/db');
const app = express();
const cors = require('cors');
const teacherRoute = require('./routes/teacher.route')
const studentRoute = require('./routes/student.route')
const courseRoute = require('./routes/course.route')
require("dotenv").config({ path: "./.env" });
const PORT = process.env.PORT || 5000
connectToMongoose();
app.get('/', (req, res) => {
  res.send('Hello Server!');
});
app.use(
   cors({
    origin:"*",
  })
  // res.setHeader('Access-Control-Allow-Origin', '*');
  // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // res.setHeader('Access-Control-Allow-Headers','*')
  //cors()
 // next();
);

app.use(express.json());
app.use('/teacher', teacherRoute);
app.use('/student', studentRoute);
app.use('/course', courseRoute);


app.listen(PORT, () => {
  console.log(`Server listening at port: ${PORT}`);
});


