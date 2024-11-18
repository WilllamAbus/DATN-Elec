const { add } = require('./add');
const { getListAuction } = require('./list');
const { softDelete } = require('./softdelete');
const { getOne } = require('./getOne');
const { update } = require('./update');
const { getDeleteListAuction } = require('./getDeleteListAuction');
const { hardDeleteAuction } = require('./hardDeleteAuction');
const { restoreAuction } = require('./restoreAuction');
module.exports = {
  add,
  getListAuction,
  softDelete,
  getOne,
  update,
  getDeleteListAuction,
  hardDeleteAuction,
  restoreAuction
};
