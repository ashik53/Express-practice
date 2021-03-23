/*
    This Project I collect from https://www.youtube.com/watch?v=eYVGoXPq2RA&t=2566s
*/

/*
    This is the place where express starts to work
*/

const express = require('express');
const mongoose = require('mongoose');
const url = 'mongodb://localhost/AlienDBex'; // localhost part is the IP address of the server
const app = express();
var cors = require('cors');

mongoose.connect(url, {useNewUrlParser: true}); //db connection making
const con = mongoose.connection //connection holder

//connection on event firing 
con.on('open', ()=> {
    console.log("connected.....") //database is connected
})

/*
    if you don't inform your express app that you will use json() format, then you will face error

*/
app.use(cors())
app.use(express.json())

const alienRouter = require('./routes/aliens');
app.use('/aliens', alienRouter);

app.listen(9000, function(){
    console.log("Server started")
})
