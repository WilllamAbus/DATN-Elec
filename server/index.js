const express = require("express");
const cors = require("cors");
const path = require("path");
const logger = require("morgan");
const apiGeneral = require("./routes/api");
const routes = require("./routes/index");
require("dotenv").config();
require("./services/passport");
const cookieParser = require("cookie-parser");
const app = express();
const connectDb = require("./config/connectDb");
const http = require("http");
const socketIo = require("socket.io");
const SocketServices = require("./services/serviceSocket");

// Connect to database
connectDb();

// Setup view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Serve HTML file from socket.io folder

// CORS setup
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

// Create HTTP server and integrate with Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:4000", "http://localhost:3150"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    maxAgeSeconds: 3600,
  },
});

global.__basedir = __dirname;
global._io = io;

// Handle socket connections
io.on("connection", (socket) => {
  SocketServices.connection(socket); // Use SocketServices to handle connections
});

// Set up routes
app.use("/api", apiGeneral);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "soket.io", "socket.html"));
});
routes(app);

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
