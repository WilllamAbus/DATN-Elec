const express = require("express");
const app = express();

const cors = require("cors");

const http = require('http');
const socketIo = require('socket.io');
const connectDb = require("./config/connectDb");
// const firebaseAdmin = require('./config/firabaseConfig')
const  SocketServices  =  require('./services/serviceSocket')
// Router for api
const apiGeneral = require("./routs/api")
require('dotenv').config


//databse call
connectDb();

// firebaseAdmin()
// midleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors())
const server = http.createServer(app);

// Initialize socket.io with the HTTP server
const io =  socketIo(server, {
   cors: {
    origin: ["http://localhost:4000"],
     methods: ["GET", "POST"]
     }
   });
global.__basedir  =  __dirname;
global._io  = io;
// global.io = io;
io.on('connection', SocketServices.connection);


//Headd Api
app.use('/api', apiGeneral);



const PORT = process.env.PORT ;
// global._io.on('connection',  SocketServices.connection)
//listen server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
