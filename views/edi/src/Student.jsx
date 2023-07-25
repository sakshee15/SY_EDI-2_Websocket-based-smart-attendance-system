import React, { useState, useEffect } from "react";
import axios from "axios";


function Student() {
  const [value, setValue] = useState("");
  const [response, setResponse] = useState({});
  const [response2, setResponse2] = useState({});
  const [cname, setcname] = useState("");
  const [options, setOptions] = useState([]);
  const [tr,settr] = useState([])

  
  function onChange(e) {
    const selectedOption = e.target.value;
    settr([])
    
    const selectedCourse = response.courses_enrolled.find(course => course.course_name === selectedOption);
    
    if (selectedCourse) {
      setValue(selectedOption);
      setcname(selectedOption);
  
      const getCourses = async () => {
        const token = localStorage.getItem("token");
        let config = {
          headers: {
            "Content-Type": "application/json",
            authtoken: token,
          },
        };
  
        try {
          
          var res = await axios.get(`http://localhost:5000/student/getCourseAttendance/${selectedOption}`, config);
          console.log("res data first useefect :",res.data.data)
          setResponse2(res.data);
        } catch (err) {
          console.log("error", err);
          window.alert("Some error occurred");
        }
      };
  
      getCourses();
    }
  }

  
  
  useEffect(() => {
    const getCourses = async () => {
      const token = localStorage.getItem("token");
      let config = {
        headers: {
          "Content-Type": "application/json",
          authtoken: token,
        },
      };

      try {
        var res = await axios.get("http://localhost:5000/student/getCourse", config);
        console.log("res data getcourse  2nd :",res.data.data)

        setResponse(res.data.data);
      } catch (err) {
        console.log("error", err);
        window.alert("Some error occurred");
      }
    };

    getCourses();
  }, []);
  useEffect(() => {
    if (response2.details && response2.details.length > 0) {
      const table = response2.details.map((course, index) => (
        <tr key={index}>
          
          
          <td>{course.present_or_not}</td>
          <td>{course.date}</td>
        </tr>
      ));
  
      settr(table);
    }
  }, [response2]);

  useEffect(() => {
    
    if (response.courses_enrolled && response.courses_enrolled.length > 0) {
      const options = response.courses_enrolled.map((course) => (
        <option key={course._id} value={course.course_name}>
          {course.course_name}
        </option>
      ));
  console.log("options :",options);
      setOptions(options);
    }
  }, [response]);
  

  return (
    <>
      <h1 className="course">Select course</h1>
      <div className="select">
        <select onChange={onChange}  value={value}>
          <option value=""  disabled hidden>
            Choose here
          </option>
          {options}
        </select>
      </div>
      <div className="table">{tr}</div>
    </>)}
export default Student;

