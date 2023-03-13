import React, { useState } from "react";
import Show from './Show';
import data from './data';

function Student() {
  const [value, setValue] = useState('');
  
  function onchange(e) {
    const val = e.target.value;
    setValue(val);
  }
  
  function show() {
    return data.filter((e) => e.course === value)
               .map((e, index) => {
                return(

               <>
               <Show key={index} date={e.date} att={e.attendance} />
               
               
               
               </>)});
  }

  return (
    <>
     <h1 className='course'>Select course</h1>
      <div className="select">
       
        
          <select onChange={onchange} >
            <option value='IOT'>IOT</option>
            <option value='DMS'>DMS</option>
            <option value='OOPS'>OOPS</option>
            <option value='DS'>DS</option>
          </select>
        
          </div>
          <div className="table">

          
          {show()}
         
       
        </div>
    </>
  );
}

export default Student;
