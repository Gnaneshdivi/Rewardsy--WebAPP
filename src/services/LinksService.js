import { getBaseURL, APICallHandler } from "./APIServices";
// 1. Get Links by Store ID
export const getLinksByStore = async (storeId) => {
    try {
      console.log(storeId);
      const url = `${getBaseURL()}/links/by-store/${storeId}`;
      const response = await APICallHandler(url, 'GET');
      return response;
    } catch (error) {
      console.error(`Failed to fetch links for store ${storeId}: ${error.message}`);
      throw error;
    }
  };
  
  // 2. Get Links by Screen
  export const getLinksByScreen = async (screen, storeId) => {
    try {
      const url = `${getBaseURL()}/links/by-screen?screen=${screen}&storeId=${storeId}`;
      const response = await APICallHandler(url, 'GET');
      return response;
    } catch (error) {
      console.error(`Failed to fetch links for screen ${screen}: ${error.message}`);
      throw error;
    }
  };
  export const getLinkUpiById = async ( id) => {
    try {
      const url = `${getBaseURL()}/links/upi/${id}`;
      const response = await APICallHandler(url, 'GET');
      return response;
    } catch (error) {
      console.error(`Failed to fetch link for location ${location}: ${error.message}`);
      throw error;
    }
  };
  // 3. Get Links by Screen Location
  export const getLinkByScreenLocation = async (location, storeId) => {
    try {
      const url = `${getBaseURL()}/links/by-screen-location?location=${location}&storeId=${storeId}`;
      const response = await APICallHandler(url, 'GET');
      return response;
    } catch (error) {
      console.error(`Failed to fetch link for location ${location}: ${error.message}`);
      throw error;
    }
  };
  
  // 4. Get Link by ID
  export const getLinkById = async (id) => {
    try {
      const url = `${getBaseURL()}/links/${id}`;
      const response = await APICallHandler(url, 'GET');
      return response;
    } catch (error) {
      console.error(`Failed to fetch link with ID ${id}: ${error.message}`);
      throw error;
    }
  };