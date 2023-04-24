import React ,{useState}from 'react';
// import data from './data';
import axios from 'axios'
import {Link} from 'react-router-dom'
import { useNavigate } from "react-router-dom";
function Login(){
    const [fullname, setfullname] = useState({
        email : '',
        password: "",


    });
    
    const navigate = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault();
        const { email,password} = fullname;
    
        let body = JSON.stringify({
            email,password
         
        });
    
        let config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
    
        try {
          var response = await axios.post(
            "http://localhost:5000/student/login",
            body,
            config
          );
          console.log(response.body);
         
          if (response.status === 400) {
            window.alert(response.data.error)
          } else {
            localStorage.setItem("token",response.data.authtoken)
            // window.alert(data.message);
            navigate('login/student');
          }
        } catch (err) {
          console.log(err);
          window.alert("no student found")
        }
      };
    function change(event){
        let name = event.target.name;
        let value = event.target.value;

            setfullname((preValue)=>{
                return{
                    ...preValue,
                    [name]:value
                };
            })
        }


        const handleSubmit2 = async (event) => {
            event.preventDefault();
            const { email,password } = fullname;
        
            let body = JSON.stringify({
                email,password 
             
            });
        
            let config = {
              headers: {
                "Content-Type": "application/json",
              },
            };
        
            try {
              var response = await axios.post(
                "http://localhost:5000/teacher/login",
                body,
                config
              );
              console.log(response.data);
             
              if (response.status === 400) {
                window.alert(response.data.error)
              } else {
                localStorage.setItem('token',response.data.authtoken);
                // window.alert(data.message);
                navigate('/login/teacher');
              }
            } catch (err) {
              console.log(err);
              window.alert("No teacher found")
            }
          };
        

    

        return(
    <>

        <form>
        <div className='main'>
            <div className='box'>

            <h1>Login</h1>
            <input type="text" placeholder='Enter Username' onChange={change} value={fullname.email} name="email" required/>
            <input type="text" placeholder='Enter Password' onChange={change} value={fullname.password } name = "password" required/>
            <span><button onClick = {handleSubmit}>Student</button></span>
            <span><button onClick = {handleSubmit2}>Teacher</button></span>
            <p>Don't have account? <Link to ='./register'>Create Account</Link></p>
            </div>
            </div>
            </form>
            </>
        )
}
export default Login;