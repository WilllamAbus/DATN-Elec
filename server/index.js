const express = require("express");
const cors = require("cors");
const connectDb = require("./config/connectDb");
const apiGeneral = require("./routes/api");
const auth = require("./routes/auth");
const routes = require("./routes/index");
require('dotenv').config();
require('./services/passport');
cookieParser = require('cookie-parser')
const app = express();


app.use(cors({
  origin: process.env.URL_FE,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  credentials: true
}));


app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);
app.use('/api', apiGeneral);
app.use('/api',  auth);
// Kết nối đến cơ sở dữ liệu
connectDb();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
