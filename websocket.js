const WebSocket = require('ws');
const axios = require('axios');

const wss = new WebSocket('ws://192.168.4.71:80/MPU');
console.log('starting websocket')
wss.onopen = () => {
  console.log('Connected to server');
  wss.send('Hello, server!');
};

wss.onmessage = async function (event,socket) {
  data = event.data;
  console.log(typeof data,data);
  await axios.post(`http://localhost:3001/student/processMessage/640e8834c4298bbd1fc89229/${data}`)
  .then((result)=>{
       console.log(result)
  })
  .catch((err)=>{
    console.log(err)
  })
};
wss.onerror = function (event) {
  console.error('WebSocket error:', event);
}
wss.onclose = () => {
  console.log('Disconnected from server');
};

