'use strict'

const Service =  require('../../model/customer-service/services.model')

const apiServices = {
    createService : async (serviceData) =>{
        try {
            // Destructure the required fields from serviceData
            const { service_name, description, serviceOpenDate } = serviceData;
      
            // Validate input data
            if (!service_name || !description || !serviceOpenDate) {
              throw new Error("Missing required fields: service_name, description, and serviceOpenDate are required.");
            }
      
            // Check if the service already exists
            const existingService = await Service.findOne({ service_name });
            if (existingService) {
              throw new Error(`The service "${service_name}" already exists. Please use a different name.`);
            }
      
            // Create a new Service document
            const newService = new Service({
              service_name,
              description,
              serviceOpenDate,
              // Any additional fields can be added here
            });
      
            // Save the Service to the database
            const savedService = await newService.save();
      
            return savedService;
          } catch (error) {
            console.error("Error creating service:", error);
            throw new Error(`Error creating service: ${error.message}`);
          }
        
    },
    updateService: async (id, data) => {
        try {
          const updatedService = await Service.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
          });
    
          if (!updatedService) {
            throw new Error("Service not found.");
          }
    
          return updatedService;
        } catch (error) {
          console.error("Error updating service:", error.message);
          throw new Error(error.message);
        }
      },
    
      deleteService: async (id) => {
        try {
          const deleteService = await Service.findByIdAndDelete(id);
          return deleteService;
        } catch (error) {
          console.error("Error deleting service:", error.message);
          throw new Error(error.message);
        }
      },
    
      getAllServices: async () => {
        try {
          const allServices = await Service.find({ status: { $ne: 'deleted' } });
          return allServices;
        } catch (error) {
          console.error("Error fetching services:", error);
          throw new Error("Failed to fetch services");
        }
      },
    
      softDeleteService: async (id) => {
        try {
          const nowUtc = new Date();
          const offset = 7 * 60 * 60 * 1000;
          const now = new Date(nowUtc.getTime() + offset);
    
          const softDeleteService = await Service.findByIdAndUpdate(
            id,
            { status: "disable", disabledAt: now },
            { new: true }
          );
          return softDeleteService;
        } catch (error) {
          console.error("Error in softDeleteService:", error.message);
          throw new Error(error.message);
        }
      },
    
      getDeletedServices: async () => {
        try {
          const deletedServices = await Service.find({ status: 'disable' }) || [];
          return deletedServices;
        } catch (error) {
          console.error("Error fetching deleted services:", error);
          throw new Error("Failed to fetch deleted services");
        }
      },
    
      restoreService: async (id) => {
        try {
          const restoredService = await Service.findByIdAndUpdate(
            id,
            { status: "active" },
            { new: true }
          );
          return restoredService;
        } catch (error) {
          console.error("Error in restoreService:", error.message);
          throw new Error(error.message);
        }
      }
}

module.exports =  apiServices