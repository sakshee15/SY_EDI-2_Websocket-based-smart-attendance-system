import React ,{useState}from 'react';
import data from './data';
import {Link} from 'react-router-dom'
function Login(){
    const [fullname, setfullname] = useState({
        uname : '',
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
         
    
    
    
    // function Student(event){
    //     event.preventDefault()
      
    //     data.map((e)=>{
    //        console.log(e.email)
    //        console.log(fullname.uname)
    //         if(fullname.uname===e.email&&fullname.psw===e.psw){
    //           return console.log("yess");
    //         }
    //         else{
    //             return console.log("no");
    //         }

    //     })
       
    // }

        return(
    <>
       
        <form>
        <div className='main'>
            <div className='box'>
            
            <h1>Login</h1>
            <input type="text" placeholder='Enter Username' onChange={change} value={fullname.uname} name="uname" required/>
            <input type="text" placeholder='Enter Password' onChange={change} value={fullname.psw } name = "psw" required/>
            <span><button ><Link to='./student'>Student</Link></button></span>
            <span><button >Teacher</button></span>
            <p>Don't have account? <Link to ='./register'>Create Account</Link></p>
            </div>
            </div>
            </form>
            </>
        )
}
export default Login;