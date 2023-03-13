import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Navbar'
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import About from './About';
import Login from './Login';
import Student from './Student'
import  Home from './Home';
import Register from './Register';
function App() {
  return (
   <>
   <Navbar/>
   <Routes>
    <Route path="/" element = {<Home/>}/>
    <Route path="login" element = {<Login/>}/>
    <Route path="about" element = {<About/>}/>
    <Route path="login/register" element = {<Register/>}/>
    <Route path="login/student" element = {<Student/>}/>
  </Routes>

   </>
  );
}

export default App;
