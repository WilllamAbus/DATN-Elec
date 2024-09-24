const express = require('express');
const router = express.Router();
const {
  addRam,
  addColor,
  addScreen,
  addStorage,
  addOperatingSystem,
  addCpu,
  addGraphicsCard,
  addBattery
} = require('../../../controler/admin/attributes');
router.post('/add-ram', addRam);
router.post('/add-color', addColor);
router.post('/add-screen', addScreen);
router.post('/add-storage', addStorage);
router.post('/add-perating-system',addOperatingSystem);
router.post('/add-cpu',addCpu);
router.post('/add-graphics-card',addGraphicsCard);
router.post('/add-battery',addBattery);
module.exports = router;
