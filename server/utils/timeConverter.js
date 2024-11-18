
const moment = require('moment-timezone');
const convertToLocalTime = (date) => {
  return moment(date).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');
};

module.exports = {
  convertToLocalTime,
};
