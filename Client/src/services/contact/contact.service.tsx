import instance from "../axios";

export const addContacts = async (contact :any) =>{
    try{
      const response = await instance.post("/client/contact/add", contact, {
        headers: {
          'Content-Type': 'application/json'
        ,}
      });
      return response.data;
    }catch(error){
      console.error("Error adding contact:", error);
      throw error;
    }
  };
