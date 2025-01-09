// /api/admin/statistical
const express = require(`express`);
const router = express.Router();
const product = require(`../../../controler/admin/statistical`);

router.get('/list',product.topViewProduct);
router.get('/totalProduct',product.totalQuantityProduct);
router.get('/pendingOder',product.pendingOrder);
router.get('/totalCate',product.totalCategories);
router.get('/productSold',product.totalProductsSold);
router.get('/charProduct',product.productCate);
router.get('/productInCateActive',product.productByCategoryActive);
router.get('/productInCateDisable',product.productByCategoryDisable);
router.get('/getTopComment',product.topComments);
router.get('/accCountUser',product.totalUser);
router.get('/revenue', product.revenue);
router.get('/update', product.updateNormalizedNames);
module.exports = router;
