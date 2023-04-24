import React ,{useState} from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
 
function Register() {
  const [fullname, setfullname] = useState({
    name : '',
    email:'',
    phoneNumber:'',
    password : "",
  });

  const navigate = useNavigate();


  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name,email,phoneNumber, password } = fullname;

    let body = JSON.stringify({
      name,email,phoneNumber,
      password,
    });

    let config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      var response = await axios.post(
        "http://localhost:5000/teacher/register",
        body,
        config
      );
      console.log(response.data);
     
      if (response.status === 400) {
        window.alert(response.data.error)
      } else {
        // window.alert(data.message);
        navigate('/Login');
      }
    } catch (err) {
      console.log(err);
      window.alert(err.response.data.error)
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

  return (
    <>
      <form>
        <div className='Rmain'>
          <div className='Rbox'>
            <h1>Register</h1>
            <input type="text" placeholder='Enter Name' onChange={change} value={fullname.name} name="name" required/>
            <input type="text" placeholder='Enter Phone number' onChange={change} value={fullname.phoneNumber } name = "phoneNumber" required/>
            <input type="email" placeholder='Enter Email' onChange={change} value={fullname.email } name = "email" required/>
            <input type="text" placeholder='Enter Password' onChange={change} value={fullname.password } name = "password" required/>

            <span><button onClick={handleSubmit}>Submit</button></span>
          </div>
        </div>
      </form>
    </>
  );
}

export default Register;
