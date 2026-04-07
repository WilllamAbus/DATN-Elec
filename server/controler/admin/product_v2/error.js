const STATUS_OK = 200;
const STATUS_CREATED = 201; 
const STATUS_NOT_FOUND = 404;
const STATUS_INTERNAL_ERROR = 500;

const createErrorResponse = (message, status) => ({
  success: false,
  err: 1,
  msg: message,
  status: status
});


const createSuccessResponse = (message, data) => ({
  success: true,
  err: 0,
  msg: message,
  status: STATUS_CREATED,
  data: data,
});

module.exports = { 
  createErrorResponse, 
  createSuccessResponse,
  STATUS_OK, 
  STATUS_CREATED, 
  STATUS_NOT_FOUND, 
  STATUS_INTERNAL_ERROR 
};
