const express = require('express');
const Nexmo = require('nexmo');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const ejs = require('ejs');

//init Nexmo
const nexmo = new Nexmo({
  apiKey:'9c7a2936',
  apiSecret:'bcf0ac13d05290f0'
}, {debug: true});

const app = express();

// Template engine setup
app.set('view engine', 'html');
app.engine('html',ejs.renderFile);

//Public folder setup
app.use(express.static(__dirname + '/public'));

//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend:true}));

//Define port
const port = 3000;

app.get('/', (req, res)=>{

    res.render('index');
});

app.post('/', (req, res)=>{
  const number =req.body.number;
  const text = req.body.text;
  //console.log(req.body);

  nexmo.message.sendSms(
  '12013360131', number, text, {type:'unicode'},
      (err, responseData)=>{
         if(err){
           console.log(err);
         }else{
           console.dir(responseData);
   
           //get data from responseData
             const data = {
               id: responseData.messages[0]['message-id'],
               number:responseData.messages[0]['to']
             }
             //Emit to the client
             io.emit('smsStatus', data);


         }
      }
    );



});



const server = app.listen(port, ()=> console.log(`server started on port ${port}`));

//connect to socket.io
const io = socketIO(server);

io.on('connection',(socket)=>{

     console.log('Connected');
     io.on('Disconnect', ()=>{
         console.log('Disconnected');
     })

});
