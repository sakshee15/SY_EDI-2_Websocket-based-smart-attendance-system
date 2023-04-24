import React from "react";


function Show(props){
    return(<>
    <tr >
        <td>{props.date}</td>
        <td>{props.att}</td>
        <td>{props.name}</td>
    </tr>

    </>)


}
export default Show;