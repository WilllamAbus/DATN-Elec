const express = require("express");
const cors = require("cors");
const connectDb = require("./config/connectDb");
const apiGeneral = require("./routes/api");
const user = require("./routes/user");
require('dotenv').config();
require('./services/passport');

const app = express();

// Cấu hình CORS
app.use(cors({
  origin: process.env.URL_FE,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  credentials: true
}));

// Sử dụng middleware để xử lý JSON và URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sử dụng các route đã định nghĩa
const routes = require("./routes/index");
routes(app);
app.use('/api', apiGeneral);
app.use('/api',  user);
// Kết nối đến cơ sở dữ liệu
connectDb();

// Lắng nghe các kết nối tới server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
