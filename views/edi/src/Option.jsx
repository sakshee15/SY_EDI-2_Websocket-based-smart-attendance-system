import react from 'react';
function Option(props){
    if(props.res!=undefined){
        
        return(<>
            <option value='IOT'>{props.res.courses[0].course_name}</option>
                        <option value='DMS'>DMS</option>
                        <option value='OOPS'>OOPS</option>
                        <option value='DS'>DS</option>
                        </>) 
    }
    else{
        return(<><option value="" selected disabled hidden>Choose here</option> 
        <h1>hi</h1></>)
    }
}
export default Option;