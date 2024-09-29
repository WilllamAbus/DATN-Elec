const express = require('express');
const router = express.Router();
const {
  getAllRam,
  getAllColor,
  getAllCpu,
  getAllScreen,
  getAllGraphicsCard,
  getAllBattery,
  getAllOperatingSystem,
  getAllStorage
} = require('../../controler/client');
router.get('/get-all-ram',getAllRam);
router.get('/get-all-color',getAllColor)
router.get('/get-all-cpu',getAllCpu)
router.get('/get-all-screen',getAllScreen)
router.get('/get-all-graphics-card',getAllGraphicsCard)
router.get('/get-all-battery',getAllBattery)
router.get('/get-all-operating-system',getAllOperatingSystem)
router.get('/get-all-storage',getAllStorage)
module.exports = router;
