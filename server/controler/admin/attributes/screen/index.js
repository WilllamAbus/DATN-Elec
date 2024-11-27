const { addScreen } = require('./add');
const { getScreen } = require('./list');
const { softDeleteScreen } = require('./softDeleteScreen');
const { getOneScreen } = require('./getOneScreen');
const { editScreen } = require('./editScreen');
module.exports = {
  addScreen,
  getScreen,
  softDeleteScreen,
  getOneScreen,
  editScreen
};
