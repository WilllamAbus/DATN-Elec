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
// const redisClient = require("./services/redis.js");
const socketIo = require("socket.io");
const SocketServices = require("./services/serviceSocket");
const monitorChangeStream = require("./services/changeStream.js");
const cron = require("node-cron");
const { checkInventoryAndNotify } = require("./services/inventoryChecker");
require("./controler/cronJob.js");
const { initializeSocket } = require('./services/skserver/socketServer.js');
connectDb();

// Setup view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));


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
const io = initializeSocket(server);

io.on("connection", (socket) => {
  const ip = socket.handshake.address;
  console.log(`New user connected: ${socket.id}, IP: ${ip}`);
});

connectDb()
  .then(() => {
    monitorChangeStream(); 
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });
// Set up routes
app.use("/api", apiGeneral);

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

// Thiết lập cron job để chạy hàng ngày lúc 00:00 (nửa đêm)
cron.schedule(
  "0 0 * * *",
  async () => {
    console.log("Bắt đầu kiểm tra tồn kho hàng ngày...");
    await checkInventoryAndNotify();
    console.log("Kiểm tra tồn kho hoàn tất và thông báo đã gửi (nếu có).");
  },
  {
    timezone: "Asia/Ho_Chi_Minh", // Đặt múi giờ nếu cần, ví dụ: Việt Nam
  }
);
