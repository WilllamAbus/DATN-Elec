const express = require("express");

const { homepage, message } = require("../controler/home");
// regisOTP
const { verifyOtp, regisUser } = require("../controler/user.controller");
// middleware
const { checkPermission } = require("../middleware/role.base");
const middlewareController = require("../middleware/auth");
const upload = require("../middleware/multer.middle");


const { createRole } = require("../controler/role.controller");
// const middlewareController = require('../middleware/auth');
// categories
const {
  uploadCategory,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
  sofDelCate,
  restore,
  deletedListCategory,
  checkCategory,
} = require("../controler/categories.controller");

// discount
const voucherController = require("../controler/voucher.controller");

// order
const orderController = require("../controler/order.controller");
// discount
const discountController = require("../controler/discount.controller");
// format
const formatController = require("../controler/formatShopp.controller");
// condition
const conditionController = require("../controler/conditon-shopp.controller");
// product
const productController = require("../controler/product_v2.controller");
/**Comments */
const commentController = require("../controler/comment.controller");
/**@author repCommment */
const repCommentController = require("../controler/repComment.controller");
/**@author repCommment */

/**Inventory */
// const inventoryController = require('../controler/inventory.controller');
/**Inventory */

/**api-service */
const ServiceController = require('../controler/orders/services/api-service.controller');
// *TimeTrack*/
const timeTrackController = require('../controler/timeTrack.controller');
const router = express.Router();
// Test
router.get("/", homepage);
router.get("/message", message);
// Users - regisOTP
router.post("/users", regisUser);
router.post("/users/verifyOtp", verifyOtp);

// Add Roles
router.post("/addRole", checkPermission, createRole);

// Categoris

router.post(
  "/addCate",
  middlewareController.verifyToken,
  upload.single("imgCate"),
  uploadCategory
);
router.get("/getAllCate", getAllCategoriesController);
router.get("/getCate/:id", getCategoryByIdController);
router.put(
  "/updateCate/:id",
  middlewareController.verifyTokenAdminAuth,
  upload.single("imgCate"),
  updateCategoryController
);
router.delete(
  "/delete/:id",
  middlewareController.verifyToken,
  deleteCategoryController
);
router.get("/checkCategory/:name", checkCategory);
router.patch("/soft-delete/:id", middlewareController.verifyToken, sofDelCate);
router.get(
  "/deleted-list",
  middlewareController.verifyToken,
  deletedListCategory
);
router.patch("/restore/:id", middlewareController.verifyToken, restore);

// voucher
router.post(
  "/addVoucher",
  middlewareController.verifyToken,
  voucherController.createVoucher
);
router.get("/getAllVoucher", voucherController.getAllVoucher);
router.get("/getVoucher/:id", voucherController.getVoucherById);
router.put(
  "/updateVoucher/:id",
  middlewareController.verifyToken,
  voucherController.updateVoucher
);
router.delete(
  "/deleteVoucher/:id",
  middlewareController.verifyToken,
  voucherController.deleteVoucher
);

router.patch(
  "/soft-deleteVoucher/:id",
  middlewareController.verifyToken,
  voucherController.sofDelVoucher
);
router.get(
  "/deleted-listVoucher",
  middlewareController.verifyToken,
  voucherController.deletedListVoucher
);
router.patch(
  "/restoreVoucher/:id",
  middlewareController.verifyToken,
  voucherController.restore
);

// order
router.post(
  "/addOrder",
  middlewareController.verifyToken,
  orderController.createOrder
);
router.get("/getAllOrder", orderController.getAllOrder);
router.get("/getOrder/:id", orderController.getOrderbyId);
router.delete(
  "/deleteOrder/:id",
  middlewareController.verifyToken,
  orderController.deleteOrderById
);

router.patch(
  "/soft-deleteOrder/:id",
  middlewareController.verifyToken,
  orderController.sofDelOrder
);
router.get(
  "/deleted-listOder",
  middlewareController.verifyToken,
  orderController.deletedListOrder
);
router.patch(
  "/restoreOrder/:id",
  middlewareController.verifyToken,
  orderController.restore
);

// discount
router.post(
  "/addDiscount",
  middlewareController.verifyTokenAdminAuth,
  discountController.createDiscount
);
router.get("/getAllDiscount", discountController.getAllDiscount);
router.get("/getDiscount/:id", discountController.getDiscountById);
router.delete(
  "/deleteDiscount/:id",
  middlewareController.verifyTokenAdminAuth,
  discountController.deleteDiscount
);
router.put(
  "/updateDiscount/:id",
  middlewareController.verifyTokenAdminAuth,
  discountController.updateDiscount
);

router.patch(
  "/soft-deleteDiscount/:id",
  middlewareController.verifyTokenAdminAuth,
  discountController.sofDelDiscount
);
router.get("/deleted-listDiscount", discountController.deletedListDiscount);
router.patch(
  "/restoreDiscount/:id",
  middlewareController.verifyTokenAdminAuth,
  discountController.restore
);

// formatShopp

router.post(
  "/addFormat",
  middlewareController.verifyTokenAdminAuth,
  formatController.createFormat
);
router.get("/getAllFormat", formatController.getAllFormat);
router.get("/getFormat/:id", formatController.getFormatById);
router.delete(
  "/deleteFormat/:id",
  middlewareController.verifyTokenAdminAuth,
  formatController.deleteFormat
);
router.put(
  "/updateFormat/:id",
  middlewareController.verifyTokenAdminAuth,
  formatController.updateFormat
);

router.patch(
  "/soft-deleteFormat/:id",
  middlewareController.verifyTokenAdminAuth,
  formatController.sofDelFormat
);
router.get("/deleted-listFormat", formatController.deletedListFormat);
router.patch(
  "/restoreFormat/:id",
  middlewareController.verifyTokenAdminAuth,
  formatController.restore
);

// conditioShooo

router.post(
  "/addCondition",
  middlewareController.verifyTokenAdminAuth,
  conditionController.createCondition
);
router.get("/getAllCondition", conditionController.getAllCondition);
router.get("/getCondition/:id", conditionController.getConditionById);
router.delete(
  "/deleteCondition/:id",
  middlewareController.verifyTokenAdminAuth,
  conditionController.deleteCondition
);
router.put(
  "/updateCondition/:id",
  middlewareController.verifyTokenAdminAuth,
  conditionController.updateCondition
);

router.patch(
  "/soft-deleteCondition/:id",
  middlewareController.verifyTokenAdminAuth,
  conditionController.sofDelCondition
);
router.get("/deleted-listCondition", conditionController.deletedListCondition);
router.patch(
  "/restoreCondition/:id",
  middlewareController.verifyTokenAdminAuth,
  conditionController.restore
);

// productsV2
router.delete(
  "/products_v2/deleteProductV2/:id",
  middlewareController.verifyTokenAdminAuth,
  productController.deleteProduct
);
router.post(
  "/products_v2/addProducts",
  middlewareController.verifyTokenAdminAuth,
  upload.array("images"),
  productController.createProduct
);
router.put(
  "/products_v2/editProduct/:id",
  middlewareController.verifyTokenAdminAuth,
  upload.array("images"),
  productController.updateProduct
);
router.get("/products_v2/getAllProduct", productController.getAllProduct);
router.patch(
  "/products_v2/soft-deleteProduct/:id",
  middlewareController.verifyTokenAdminAuth,
  productController.softDeleteProduct
);
router.get(
  "/products_v2/deleted-listProduct",
  productController.getDeletedProducts
);
router.get("/products_v2/getProductById/:id", productController.getProductById);
router.get("/products_v2/search/:keyword", productController.searchProducts);
router.get("/products_v2/suggestions", productController.getSuggestions);
router.get("/products_v2/searchAdmin", productController.searchProductAdmin);
router.get(
  "/products_v2/list-categories",
  productController.getAllCategoriesController
);
router.get(
  "/products_v2/list-conditions",
  productController.getAllConditionsController
);
router.get(
  "/products_v2/list-formats",
  productController.getAllFormatsController
);
router.get(
  "/products_v2/list-discounts",
  productController.getAllDiscountsController
);
router.put("/products_v2/upView/:id", productController.upView);
router.get("/products_v2/filter/:price", productController.price);
router.patch(
  "/products_v2/restoreProducts/:id",
  middlewareController.verifyTokenAdminAuth,
  productController.restore
);

/**productsV2 */
// Api tỉnh thành

/**Comments */
// Route to get user by ID
router.get("/user/:id", commentController.userID);
// Route to create a new comment
router.post("/addComment", commentController.comment);
// Route to get comments for a specific product by product ID
router.get("/comments/:id", commentController.commentProduct);
// Route to delete a comment by ID
router.delete(
  "/deleteComment/:id",
  middlewareController.verifyTokenAdminAuth,
  commentController.deleteComment
);
// Route to get all comments with pagination
router.get("/getAllCommentsPagi", commentController.getAllComments);
// Route to soft delete a comment by ID
router.put(
  "/soft-deleteComment/:id",
  middlewareController.verifyTokenAdminAuth,
  commentController.softDeleteComment
);
// Route to get all soft-deleted comments with pagination
router.get("/comments/deleted", commentController.getDeletedComments);
// Route to restore a soft-deleted comment by ID
router.put(
  "/comments/restore/:id",
  middlewareController.verifyTokenAdminAuth,
  commentController.restoreComment
);
// Route to get suggestions based on a query
router.get("/comments/suggestions", commentController.getSuggestions);
// Route to search comments for admin with pagination
router.get("/comments/search", commentController.searchCommentsAdmin);

/*repCOmmment*/
// Route to create a reply to a comment
router.post("/repComment", repCommentController.repComment);
// Route to get replies for a specific comment by comment ID
router.get("/comment/:id", repCommentController.getRepComment);




/**Inventory */

// router.post('/inventory', middlewareController.verifyTokenAdminAuth, inventoryController.createInventory);
// router.put('/inventory/:id', middlewareController.verifyTokenAdminAuth, inventoryController.editInventory);
// router.get('/inventory/:id', inventoryController.getInventoryById);
// router.get('/inventories', inventoryController.getAllInventory);
// router.delete('/inventory/:id', middlewareController.verifyTokenAdminAuth, inventoryController.deleteInventory);
// router.patch('/inventory/:id', middlewareController.verifyTokenAdminAuth, inventoryController.softDeleteInventory);
// router.get('/deleted-inventories', inventoryController.deletedListInventory);
// router.patch('/restore-inventory/:id', middlewareController.verifyTokenAdminAuth, inventoryController.restoreInventory);
// router.get('/products', inventoryController.getAllProductsV2);
// router.get('/suppliers', inventoryController.getAllSuppliers);
// router.get('/search-inventory', inventoryController.searchInventoryAdmin);
// router.get('/inventory-suggestions', inventoryController.getSuggestions);

/**Inventory */


// *timeTrack*/

router.post('/time-tracks', timeTrackController.updateEndTime);   // POST /time-tracks

router.get('/producuByTimeTrack/:productId', timeTrackController.getTimeTractByProductDetails); // GET /time-tracks/:id
router.get('/time-tracks', timeTrackController.getAllTimeTrack);   // GET /time-tracks
router.put('/time-tracks/:id', timeTrackController.update); // PUT /time-tracks/:id
// PATCH /time-tracks/:id
router.delete('/time-tracks/:id', timeTrackController.delete);
router.get('/timeTrackById/:id', timeTrackController.getTimeTrackById);  // DELETE /time-tracks/:id
router.post('/createTimeTrack',middlewareController.verifyTokenAdminAuth, timeTrackController.create);
router.get('/timeTrackAdmin', timeTrackController.getAllTimeTracksAdmin);
router.put('/editTimeTrackAdmin/:id',middlewareController.verifyTokenAdminAuth, timeTrackController.editTimeTrackAdmin);
router.patch('/softDel/:id',middlewareController.verifyTokenAdminAuth, timeTrackController.softDelTimeTrack); // GET /edittimeTrackAdmin // GET /edittimeTrackAdmin
router.patch('/restoreTimAdmin/:id', middlewareController.verifyTokenAdminAuth, timeTrackController.restoreTimeTrackAdmin); // GET /edittimeTrackAdmin // GET /edittimeTrackAdmin
router.get('/deletedTime', middlewareController.verifyTokenAdminAuth, timeTrackController.deletedTimeTrackAdmin);
router.get('/getProductBy', timeTrackController.getProductAuctionAdmin);
/**Time Track */


/**api service */

router.post('/createServcie', ServiceController.createService);
router.get('/services', ServiceController.getAllServices);
router.get('/services/:id', ServiceController.getServiceById);
router.put('/services/:id', ServiceController.updateService);
router.delete('/services/:id', ServiceController.deleteService);
router.patch('/services/soft-delete/:id', ServiceController.softDeleteService);
router.get('/services/deleted', ServiceController.getDeletedServices);
router.patch('/services/restore/:id', ServiceController.restoreService);

/**api service */
module.exports = router;
