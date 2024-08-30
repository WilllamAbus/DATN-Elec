const googleRouter = require("./authGoogle");
const authRouter = require("./auth");
const userRouter = require("./user");
const productRouter = require("./admin/product/product");
const userRoutes = require("./admin/auth/userRoutes");
const brandRouter = require("./admin/brands/brands");
const supplierRoutes = require('./admin/suppliers/suppliers');
const adminProduct = require("./admin/product_v2");
const clientProduct = require("./client/product");
const productRouter_v2 = require("./admin/product_v2");
// const supplierRoutes = require("./admin/suppliers/suppliers");
const WathListRouter = require("./product/product");
const vnPayRouter = require('./admin/vnpay/order')
const randBidRouter = require('./admin/randBid/randBid.routes')
const biddingRouter = require('./client/bidding/bidding.routes')
const auctionsRouter = require('./client/auctions/auctions.routes')
const routes = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/auth", googleRouter);
  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);
  app.use("/api/admin", userRoutes);
  app.use('/api/brands', brandRouter);
  app.use('/api/suppliers', supplierRoutes);
  app.use("/api/admin/product", adminProduct);
  app.use("/api/client/product", clientProduct);
  app.use("/api/brands", brandRouter);
  // app.use("/api/suppliers", supplierRoutes);
  app.use("/api/wathlist", WathListRouter);
  app.use("/api/vnpay", vnPayRouter);
  app.use('/api/admin/randBid', randBidRouter)
  app.use('/api/client/bidding', biddingRouter)
  app.use('/api/client/auctions', auctionsRouter)
};

module.exports = routes;
