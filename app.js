const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io');

//Init nexmo
const nexmo = new Nexmo({
  apiKey: '',
  apiSecret: ''
}, {debug: true});
//Init App with express
const app = express();
//Template engine setup
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

//Public folder setup
app.use(express.static(__dirname + '/public'));

//Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//index route
app.get('/', (req, res) => {
  res.render('index');
});

//Catch Form submit
app.post('/', (req, res) => {
  //res.send(req.body);
  //console.log(req.body);
  const number = req.body.number;
  const text = req.body.text;
  nexmo.message.sendSms(
    'NEXMO', number, text, {type: 'unicode'},
    (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        console.dir(responseData);
        //Get data from responseData
        const data = {
          id: responseData.messages[0]['message-id'],
          number: responseData.messages[0]['to']
        }
        //Emit to the Client
        io.emit('smsStatus', data);
      }
    }
  );
});

//Define port
const port = 3000;

//Start server
const server = app.listen(port, ()=> console.log('Server Started on Port ${port}'));

//Connect to socket.io
const io = socketio(server);
io.on('connection', (socket) =>{
  io.on('disconnect',() =>{
    console.log(Disconnected);
  })
})
