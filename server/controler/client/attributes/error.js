const STATUS_OK = 200;
const STATUS_NOT_FOUND = 404;
const STATUS_INTERNAL_ERROR = 500;

const createErrorResponse = (message, status) => {
  return {
    success: false,
    err: 1,
    msg: message,
    status: status,
    total: 0, 
  };
};

module.exports = { createErrorResponse, STATUS_OK, STATUS_NOT_FOUND, STATUS_INTERNAL_ERROR };
