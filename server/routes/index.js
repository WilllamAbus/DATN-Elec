const googleRouter = require("./authGoogle");
const authRouter = require("./auth");
const userRouter = require("./user");
const productRouter = require("./admin/product/product");
const userRoutes = require("./admin/auth/userRoutes");
const brandRouter = require("./admin/brands/brands");
const vnpayRouter = require("./admin/vnpay/order");
const CartRouter = require("./product/cart");
const supplierRoutes = require("./admin/suppliers/suppliers");
const adminProduct = require("./admin/product_v2");
const clientProduct = require("./client/product");
const clientCategỏy = require("./client/category");
const WathListRouter = require("./product/product");

// const supplierRoutes = require("./admin/suppliers/suppliers");
// const WathListRouter = require("./product/product");

const vnPayRouter = require('./admin/vnpay/order')
const randBidRouter = require('./admin/randBid/randBid.routes')
const biddingRouter = require('./client/bidding/bidding.routes')
const auctionsRouter = require('./client/auctions/auctions.routes')
const orderAucRouter = require('./client/orderAndDetail/orderAndDetail.routes')
const orderDetailAuction = require('./client/details/orderDetail.routes')
const customerServiceRouter = require('./client/customer-service/deleteBidding.routes')
const notificationRouter = require('./client/notification/notification.routes')
const interactionRouter = require('./client/interaction/interation.routes')
const routes = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/auth", googleRouter);
  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);
  app.use("/api/admin", userRoutes);
  app.use("/api/suppliers", supplierRoutes);
  app.use("/api/vnpay", vnpayRouter);
  app.use("/api/cart", CartRouter);
  app.use("/api/brands", brandRouter);
  app.use("/api/suppliers", supplierRoutes);
  app.use("/api/admin/product", adminProduct);
  app.use("/api/client/product", clientProduct);
  app.use("/api/brands", brandRouter);
  app.use("/api/wathlist", WathListRouter);
  app.use("/api/vnpay", vnPayRouter);
  app.use('/api/admin/randBid', randBidRouter)
  app.use('/api/client/bidding', biddingRouter)
  app.use('/api/client/auctions', auctionsRouter)
  app.use('/api/client/category', clientCategỏy)
  app.use('/api/client/orderAuc', orderAucRouter)
  app.use('/api/client/orderDetailAuc',orderDetailAuction)
  app.use('/api/client/customer-service',customerServiceRouter)
  app.use('/api/notification',notificationRouter)
  app.use('/api/interaction',interactionRouter)
};

module.exports = routes;
