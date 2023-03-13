import React ,{useState}from 'react';
function Contact(){
    const [fullname, setfullname] = useState({
        fname : '',
        lname : "",
        email:"",
        phone:""

    });
    // const [value, setvalue] = useState('');
    // const [lastname,setlastname] =  useState('');
    // const [lvalue, setlvalue] = useState('');
    function change(event){
        let name = event.target.name;
        let value = event.target.value;
        // setfullname((preValue)=>{
            
            // if(name==='fname'){
            //     return{
            //         fname:value,
            //         lname:preValue.lname,
            //         email:preValue.email,
            //         phone:preValue.phone
            //     };
            // }else if (name==='lname'){
            //     return{
            //         fname:preValue.fname,
            //         lname:value,
            //         email:preValue.email,
            //         phone:preValue.phone

            //     };
            // }else if (name==='email'){
            //     return{
            //         fname:preValue.fname,
            //         lname:preValue.lname,
            //         email:value,
            //         phone:preValue.phone
            //     };
            // }else if (name==='phone'){
            //     return{
            //         fname:preValue.fname,
            //         lname:preValue.lname,
            //         email:preValue.email,
            //         phone:value
            //     };
            // });
            setfullname((preValue)=>{
                return{
                    ...preValue,
                    [name]:value
                };
            })
        }
         
    
    
    function click(event){
        event.preventDefault()
        alert('form submitted');
    }

        return(
    <>
       
        <form onSubmit={click}>
        <div>
            <h1>Hello {fullname.fname} {fullname.lname}</h1>
            <p> {fullname.email} {fullname.phone}</p>
            <input type="text" placeholder='Enter Your Name' onChange={change} value={fullname.fname} name="fname"/>
            <input type="text" placeholder='Enter Your last Name' onChange={change} value={fullname.lname } name = "lname"/>
            <input type="email" placeholder='Enter Your Email' onChange={change} value={fullname.email} name="email"/>
            <input type="phonenumber" placeholder='Enter Your Phone number' onChange={change} value={fullname.phone} name="phone"/>
            <button type='submit' >Click Me</button>
            </div>
            </form>
            </>
        )
}
export default Contact;