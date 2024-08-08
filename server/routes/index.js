const googleRouter = require("./authGoogle");
const authRouter = require("./auth");
const userRouter = require("./user");
const productRouter = require("./admin/product/product");
const userRoutes = require("./admin/auth/userRoutes");
const routes = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/auth", googleRouter);
  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);
  app.use("/api/admin", userRoutes);
};

module.exports = routes;
