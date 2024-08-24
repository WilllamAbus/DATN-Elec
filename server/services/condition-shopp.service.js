"use strict";



const _Condition = require("../model/condition-shop.model");



const conditionService = {


  getConditionById: async (id) => {
    return await _Condition.findById(id)
  },

  createCondition: async (conditionData) => {
    try {
      
      const {
         nameCondition

      } = conditionData;

      // Validate input data
      if (!nameCondition) {
        throw new Error("Missing required fields");
      }

    
      // Ensure cateReady is an array of strings
      const existingCondition = await _Condition.findOne({ nameCondition });
    if (existingCondition) {
      return res.status(400).json({ message: `The Condition "${nameCondition}" already exists. Please use a different Condition.` });
    }

      // Fetch categories from the database based on names

   
  
   
      // Create a Condition document
      const newCondition = new _Condition({
        nameCondition
     
      });

      // Save the Condition to the database
      const savedCondition = await newCondition.save();

      return savedCondition;
    } catch (error) {
      console.error("Error creating Condition:", error);
      throw error; // Propagate the error to be handled by the controller or middleware
    }
  },
  updateCondition: async (id, data) => {
    try {
     

      const updatedCondition = await _Condition.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (!updatedCondition) {
        throw new Error("Condition not found.");
      }

      return updatedCondition;
    } catch (error) {
      console.error("Error in updateCondition service:", error.message);
      throw new Error(error.message);
    }
  },

  deleteCondition: async (id) => {
    
    try {
       
        const deleteCondition= await _Condition.findByIdAndDelete(id);
        return deleteCondition
    } catch (error) {
        console.error("Error in updateCondition service:", error.message);
        throw new Error(error.message);
    }
    
  },
  getAllCondition:  async () => {
    try {
      // Validate page and pageSize parameters
     const conditionAll = await _Condition.find({ status: { $ne: 'deleted' } });
      // Return the list of Conditions along with pagination info
      return conditionAll
    } catch (error) {
      console.error("Error fetching Conditions:", error);
      throw new Error("Failed to fetch Conditions");
    }
  },
  softDeleteCondition: async (id) => {
    try {
    
        const nowUtc = new Date();
    
        // Chuyển đổi thời gian UTC về múi giờ Việt Nam
        // Múi giờ Việt Nam là UTC + 7 giờ
        const offset = 7 * 60 * 60 * 1000; // 7 giờ tính bằng mili giây
        const now = new Date(nowUtc.getTime() + offset);
        const softDeleteCondition = await _Condition.findByIdAndUpdate(
            id,
            { status: "disable" , disabledAt: now,},
            { new: true }
          );
      return softDeleteCondition
    } catch (error) {
      console.error(error);
    }
  },
  deletedListCondition:async () => {
    try {
      // Validate page and pageSize parameters
      const deleteListCondition =  await _Condition.find(  { status: 'disable' })|| []; 
      
      // Return the list of deleted Conditions along with pagination info
      return deleteListCondition
    } catch (error) {
      console.error("Error fetching deleted Conditions:", error);
      throw new Error("Failed to fetch deleted Conditions");
    }
},
  restore: async (id) => {
    try {
       
        const restore =  await _Condition.findByIdAndUpdate(
            id,
            { status: "active" },
            { new: true }
          );
     return restore
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = conditionService;