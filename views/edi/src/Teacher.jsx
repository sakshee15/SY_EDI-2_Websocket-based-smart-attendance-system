// import React ,{useState}from 'react';
// // import data from './data';
// import axios from 'axios'
// // import {Link} from 'react-router-dom'
// import { useNavigate } from "react-router-dom";

// import Option from './Option';
// function Teacher() {
//   // document.getElementById('select').addEventListener("click", click)
//   const [value, setValue] = useState('');
//    const [response,setresponse] = useState({});
//    const [num,setnum] = useState(0);
//   function onchange(e) {
//     const val = e.target.value;
//     setValue(val);
//   }

//   function show() {
//     return data2.filter((e) => e.course === value)
//                .map((e, index) => {
//                 return(

//                <>
//                <Show2 key={index} date={e.date} att={e.attendance} name={e.name} />



//                </>)});

//   }
// // const navigate = useNavigate();
//     const click = async (event) => {
//         // event.preventDefault();
//       //  const { email,password} = fullname;
//       setnum(num+1);
//        const token = localStorage.getItem("token")
//     // console.log(token)
//         let config = {
//           headers: {
//             "Content-Type": "application/json",
//             "authtoken":token
//           },
//         };
    
//         try {
//           var res = await axios.get(
//             "http://localhost:5000/teacher/getCourses",
//             config
//           );
//           setresponse(res.data)
          
          
          
          
         
//           if (response.status === 400) {
//             window.alert(response.data.error)
//           } else {
//             // window.alert(data.message);
//             // navigate('');

//           }
//         } catch (err) {
//           console.log("error",err);
//           window.alert("Some error occured")
//         }
//          if(num>0){
//           console.log(response.courses);
//           return (<><option value='IOT'>{response.courses[0].course_name}</option>
//           <option value='DMS'>DMS</option>
//           <option value='OOPS'>OOPS</option>
//           <option value='DS'>DS</option>
//           </>);
//         }
        
//       };
//   return (
//     <>
//      <h1 className='course'>Select course</h1>
//       <div className="select">

        
//           <select onChange={onchange}  onClick = {click} id='select' >   
//           <option value="" selected disabled hidden>Choose here</option> 
         
//             {/* <option value='IOT'>{response.courses[0].course_name}</option>
//             <option value='DMS'>DMS</option>
//             <option value='OOPS'>OOPS</option>
//             <option value='DS'>DS</option> */}
            
//           </select>

//           </div>
//           <div className="table">


//           {show()}


//         </div>
//     </>
//   );
// }
import React, { useState, useEffect } from "react";
import axios from "axios";
import Show2 from './Show2';
import data2 from './data2';

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

