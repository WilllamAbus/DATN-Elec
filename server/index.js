const express = require("express");
const cors = require("cors");
const path = require('path');

const logger = require('morgan');
const apiGeneral = require("./routes/api");
const auth = require("./routes/auth");
const routes = require("./routes/index");
require("dotenv").config();
require("./services/passport");
cookieParser = require("cookie-parser");
const app = express();
const connectDb = require("./config/connectDb");
const http = require("http");
const socketIo = require("socket.io");
const SocketServices = require("./services/serviceSocket");

require("./controler/cronJob");
//databse call
connectDb();
// firebaseAdmin()
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// midleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  cors({
    origin: process.env.URL_FE,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
    credentials: true,
  })
);
const server = http.createServer(app);

app.use(cookieParser());
// Initialize socket.io with the HTTP server
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:4000", "http://localhost:3150"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    maxAgeSeconds: 3600,
  },
});
global.__basedir = __dirname;
global._io = io;

io.on("connection", SocketServices.connection);

routes(app);
//Headd Api
app.use("/api", apiGeneral);
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
// connectDb();

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
