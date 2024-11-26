const express = require('express');
const router = express.Router();
const middlewareController = require("../../../middleware/auth");
const {
  addRam,
  addColor,
  addScreen,
  addStorage,
  addOperatingSystem,
  addCpu,
  addGraphicsCard,
  addBattery,
  addKeyCap,
  getScreen,
  getRam,
  softDeleteScreen,
  softDeleteRam,
  getOneScreen,
  getOneRam,
  editScreen,
  editRam
} = require('../../../controler/admin/attributes');
router.post('/add-ram', addRam);
router.get('/list-ram', getRam);
router.patch('/soft-delete-ram/:id',middlewareController.verifyTokenAdminAuth, softDeleteRam);
router.get('/get-one-ram/:ramId', getOneRam);
router.put('/edit-ram/:ramId', editRam);
router.post('/add-color', addColor);
router.post('/add-screen', addScreen);
router.get('/list-screen', getScreen);
router.patch('/soft-delete/:id',middlewareController.verifyTokenAdminAuth, softDeleteScreen);
router.get('/get-one-screen/:screenId', getOneScreen);
router.put('/edit-screen/:screenId', editScreen);
router.post('/add-storage', addStorage);
router.post('/add-perating-system',addOperatingSystem);
router.post('/add-cpu',addCpu);
router.post('/add-graphics-card',addGraphicsCard);
router.post('/add-battery',addBattery);
router.post('/add-keycap',addKeyCap);
module.exports = router;
