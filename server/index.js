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
const cron = require("node-cron");
const { checkInventoryAndNotify } = require("./services/inventoryChecker");
require("./controler/cronJob.js");
const { initializeSocket } = require('./services/skserver/socketServer.js');
connectDb();
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
app.use((req, res, next) => { req.io = io; next(); });
io.on("connection", (socket) => {
  const ip = socket.handshake.address;
  console.log(`KNTC: ${socket.id}, IP: ${ip}`);
});
require('./cron');

app.use("/api", apiGeneral);

routes(app);

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

cron.schedule(
  "0 0 * * *",
  async () => {
    console.log("Bắt đầu kiểm tra tồn kho hàng ngày...");
    await checkInventoryAndNotify();
    console.log("Kiểm tra tồn kho hoàn tất và thông báo đã gửi (nếu có).");
  },
  {
    timezone: "Asia/Ho_Chi_Minh", 
  }
);
