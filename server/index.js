const express = require("express");
const cors = require("cors");
const connectDb = require("./config/connectDb");
const apiGeneral = require("./routes/api");
const routes = require("./routes/index");
require('dotenv').config();
require('./services/passport');
cookieParser = require('cookie-parser')
const app = express();

const http = require('http');
const socketIo = require('socket.io');
const SocketServices = require('./services/serviceSocket');
const server = http.createServer(app);

//databse call
connectDb();

// firebaseAdmin()
// midleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.URL_FE,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  credentials: true
}));


app.use(cookieParser())
// Initialize socket.io with the HTTP server
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:4000", "http://localhost:3150"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    maxAgeSeconds: 3600
  }
});
global.__basedir = __dirname;
global._io = io;

io.on('connection', SocketServices.connection);

routes(app);
//Headd Api
app.use('/api', apiGeneral);

connectDb();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
