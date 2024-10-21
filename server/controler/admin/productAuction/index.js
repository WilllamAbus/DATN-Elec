const { add } = require('./add');
const { getListAuction } = require('./list');
const { softDelete } = require('./softdelete');
const { getOne } = require('./getOne');
const { update } = require('./update');
module.exports = {
  add,
  getListAuction,
  softDelete,
  getOne,
  update
};
