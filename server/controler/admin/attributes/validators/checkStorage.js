const Storage = require('../../../../model/attributes/storage'); 
const checkStorageNameExists = async (name) => {
  try {
    const existingStorage = await Storage.findOne({ name });
    return existingStorage ? true : false;
  } catch (error) {
    throw new Error('lỗi Storage');
  }
};
module.exports = {
  checkStorageNameExists,
};
