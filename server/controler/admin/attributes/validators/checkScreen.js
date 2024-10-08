const Screen = require('../../../../model/attributes/screen');

const checkScreenNameExists = async (name) => {
  return await Screen.findOne({ name });
};

module.exports = {
  checkScreenNameExists,
};
