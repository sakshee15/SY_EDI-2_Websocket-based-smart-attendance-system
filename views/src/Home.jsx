import React from 'react';
import {Link} from 'react-router-dom'
function Home(){
    return(
        <div className='main'>
        <div className='heading'><h1 >Websocket based Smart Attendance System using FingerPrint and RFID</h1></div>
       <Link to='./login'> <button className='success'>Login</button></Link> 
        </div>
    )
}
export default Home;