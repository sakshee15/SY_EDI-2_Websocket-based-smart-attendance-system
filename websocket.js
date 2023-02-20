const WebSocket = require('ws');
//const wss = new WebSocket.Server({ port: 80 });

// wss.on('connection', function connection(ws) {
//     ws.on('message', function incoming(message) {
//       console.log('received: %s', message);
//     });
//   });

const MPU = new WebSocket('ws://192.168.120.1:80/MPU');

MPU.onopen = () => {
    console.log('Connected to server');
    MPU.send('Hello, server!');
    // MPU.send("Raj is not working properly")
  };
MPU.onmessage = function(event) {
    data = event.data;
//   const data = JSON.parse(event.data);

//console.log(event);
  console.log(data);
}
// MPU.onmessage = (event) => {
//     console.log(`Received message: ${event.data}`);
//   };
MPU.onerror=function(event){
    console.error('WebSocket error:', event);
}
MPU.onclose = () => {
    console.log('Disconnected from server');
  };