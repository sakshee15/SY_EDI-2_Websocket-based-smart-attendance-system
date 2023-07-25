import React from 'react';
import {Link} from 'react-router-dom'
function Navbar(){
    return(<>
        <div class="topnav" id="myTopnav">
 <Link to='/'> <span className='active'>Home</span></Link>

 <Link to='/login'><span>Login</span> </Link>
 {/* <Link to='/about'> <span>About</span></Link> */}


</div>

    </>)
}
export default Navbar;