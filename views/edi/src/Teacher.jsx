
import React, { useState, useEffect } from "react";
import axios from "axios";


function Teacher() {
  const [value, setValue] = useState("");
  const [response, setResponse] = useState({});
  const [response2, setResponse2] = useState({});
  const [cname, setcname] = useState("");
  const [options, setOptions] = useState([]);
  const [tr,settr] = useState([])

  
  function onChange(e) {
    const selectedOption = e.target.value;
    settr([])
    const selectedCourse = response.courses.find(course => course.course_name === selectedOption);
    
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
          console.log(selectedOption)
          var res = await axios.get(`http://localhost:5000/teacher/getCourseAttendance/${selectedOption}`, config);
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
        var res = await axios.get("http://localhost:5000/teacher/getCourses", config);
        console.log("res data getcourse  2nd :",res.data)
        setResponse(res.data);
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
          <td>{course.student_name}</td>
          <td>{course.PRN}</td>
          <td>{course.present_or_not}</td>
          <td>{course.date}</td>
        </tr>
      ));
  
      settr(table);
    }
  }, [response2]);

  useEffect(() => {
    console.log("response",response)
    if (response.courses && response.courses.length > 0) {
      const options = response.courses.map((course) => (
        <option  key={course.course_id} value={course.course_name}>
          {course.course_name}
        </option>  ));
        
    
        console.log("options",options)
    
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
export default Teacher;

