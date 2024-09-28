const { addRam } = require('./ram/add');
const { addColor } = require('./color/add');
const { addScreen } = require('./screen/add');
const { addStorage } = require('./storage/add');
const { addOperatingSystem } = require('./operatingSystem/add');
const { addCpu } = require('./cpu/add');
const { addGraphicsCard } = require('./graphicsCard/add');
const { addBattery } = require('./battery/add');
const { addKeyCap } = require('./keyCap/add');
module.exports = {
  addRam,
  addColor,
  addScreen,
  addStorage,
  addOperatingSystem,
  addCpu,
  addGraphicsCard,
  addBattery,
  addKeyCap
};
