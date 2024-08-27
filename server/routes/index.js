const googleRouter = require("./authGoogle");
const authRouter = require("./auth");
const userRouter = require("./user");
const productRouter = require("./admin/product/product");
const userRoutes = require("./admin/auth/userRoutes");
const brandRouter = require("./admin/brands/brands");
const supplierRoutes = require('./admin/suppliers/suppliers');
const productRouter_v2 = require("./admin/product_v2");
const routes = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/auth", googleRouter);
  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);
  app.use("/api/admin", userRoutes);
  app.use('/api/brands', brandRouter);
  app.use('/api/suppliers', supplierRoutes);
  app.use("/api/product_v2", productRouter_v2);
};

module.exports = routes;
