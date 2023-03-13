import React ,{useState}from "react";
function Register(){
    
        const [fullname, setfullname] = useState({
            name : '',
            email:'',
            number:'',
            psw : "",
            
    
        });
        
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
return(
<>
<form>
        <div className='Rmain'>
            <div className='Rbox'>
            
            <h1>Register</h1>
            <input type="text" placeholder='Enter Name' onChange={change} value={fullname.name} name="name" required/>
            <input type="text" placeholder='Enter Phone number' onChange={change} value={fullname.number } name = "number" required/>
            <input type="email" placeholder='Enter Email' onChange={change} value={fullname.email } name = "email" required/>
            <input type="text" placeholder='Enter Password' onChange={change} value={fullname.psw } name = "psw" required/>
            
            <span><button>Submit</button></span>
              
            </div>
            </div>
            </form>

</>
);
}
export default Register;