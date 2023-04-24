import React from 'react';

import Navbar from './Navbar'
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import About from './About';
import Login from './Login';
import Student from './Student'
import  Home from './Home';
import Register from './Register';
import Teacher from './Teacher';
function App() {
    return (<>
        <Navbar/>
        <Routes>
         <Route path="/" element = {<Home/>}/>
         <Route path="login" element = {<Login/>}/>
         {/* <Route path="about" element = {<About/>}/> */}
         <Route path="login/register" element = {<Register/>}/>
         <Route path="login/login/student" element = {<Student/>}/>
         <Route path="login/student" element = {<Student/>}/>
         <Route path="login/teacher" element = {<Teacher/>}/>
       </Routes>
     
        </>
       );
     }
     export default App;