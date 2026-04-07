
const express = require('express');
const router = express.Router();
const { homeAllProduct,listPageAuction,resetFilter, getID, getLimitProductClient,shopping,auction,upView,search,getPhoneByVariants,getLaptopByVariants,getAccessoryByVariants} = require('../../../controler/client');
const { getProductsByCategory } = require('../../../controler/client');





router.get('/homeAllProduct', homeAllProduct);
router.get('/auction-product', listPageAuction);
router.get('/reset-filter', resetFilter);
router.get('/getLimitProductClient', getLimitProductClient);
router.get('/:id', getID);
router.get('/category/:slug', getProductsByCategory);
router.get(`/shopping/:product_format`,shopping);   
router.get(`/auction/:product_format`,auction);
router.put(`/upView/:id`,upView);
router.get(`/search/:keyword`,search);
router.get('/get-phone/:slug', getPhoneByVariants);
router.get('/get-laptop/:slug', getLaptopByVariants);
router.get('/get-accessory/:slug', getAccessoryByVariants);

module.exports = router;
