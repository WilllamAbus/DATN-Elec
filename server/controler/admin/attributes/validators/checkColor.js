const Color = require('../../../../model/attributes/color');

const checkColorNameExists = async (name) => {
  return await Color.findOne({ name });
};

module.exports = {
  checkColorNameExists,
};
