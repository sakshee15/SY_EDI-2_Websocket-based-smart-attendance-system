const WebSocket = require('ws');
const Student = require('./models/student.model');
const bcrypt = require('bcrypt');

//const wss = new WebSocket.Server({ port: 80 });

// wss.on('connection', function connection(ws) {
//     ws.on('message', function incoming(message) {
//       console.log('received: %s', message);
//     });
//   });

const wss = new WebSocket('ws://192.168.228.71:80/MPU');
console.log('starting websocket')
wss.onopen = () => {
    console.log('Connected to server');
    wss.send('Hello, server!');
    // MPU.send("Raj is not working properly")
  };
wss.onmessage = async function(event,res) {
    data = event.data;
    console.log(data);
    if(data.length === 0){
      wss.send("It is a empty string")
      return res.status(400).json({error:"A empty string received"});
    }
    const arr = data.split("_");
    try{
      const now = new Date()
      const user = await Student.findOne({email:arr[1]});
      if(!user){
        const password = await bcrypt.hash(arr[2],10)
         const student = await Student.create({
          name:arr[0],
          email:arr[1],
          PRN_no:arr[2],
          phoneNumber:arr[3],
          password:password,
        })
        student.courses_enrolled.push('640e8834c4298bbd1fc89229');
        student.save();
        student.courses_enrolled.push('640e8841c4298bbd1fc8922c');
        student.save();
        student.courses_enrolled.push('640e884bc4298bbd1fc8922f');
        student.save();
        wss.send("User registered with the website!!")
        return res.status(200).json({message:"User registered with the website"})
      }
      
       const result = await Student.findByIdAndUpdate({_id:user_id}, {$push: {
        attendance: {
          course_id: '640e8834c4298bbd1fc89229',
          dateTime: dateTime,
          present_or_not: 1,
        },
      }},{new:true})
      wss.send("Attendance of" + arr[0]+ " for IOT theory is marked ")
      return res.status(200).json({message: 'Attendance marked successfully'})


      // const currentHour = now.getHours();
      // if(currentHour >= 10 && currentHour < 11) {
             
      // } else if (currentHour >= 11 && currentHour < 12) {
          
      // }else if (currentHour >= 12 && currentHour < 13){
            
      // }else if (currentHour >= 13 && currentHour < 14){
          
      // }else{

      // }
      

    }catch(err){
      return res.status(500).json({message: err.message})
    }
}
// MPU.onmessage = (event) => {
//     console.log(`Received message: ${event.data}`);
//   };
wss.onerror=function(event){
    console.error('WebSocket error:', event);
}
wss.onclose = () => {
    console.log('Disconnected from server');
  };