const User = require('../../../../model/users.model'); // Đường dẫn đến mô hình người dùng của bạn
const Service = require('../../../../model/customer-service/services.model'); // Đường dẫn đến mô hình dịch vụ của bạn

const getUserAndService = {
    getUserEmailById : async (userId) => {
        try {
          const user = await User.findById(userId).exec();
          if (!user || !user.status === 'disable') {
            throw new Error("User not found");
          }
          return user.email;
        } catch (error) {
          throw new Error(`Error retrieving user email: ${error.message}`);
        }
      }, 
      getServiceDetailsById : async (serviceId) => {
        try {
          const service = await Service.findById(serviceId).exec();
        if (!service || !service.status === 'disable') {
            throw new Error("Service not found");
        }
          return service;
        } catch (error) {
          throw new Error(`Error retrieving service details: ${error.message}`);
        }
}

};


module.exports = getUserAndService