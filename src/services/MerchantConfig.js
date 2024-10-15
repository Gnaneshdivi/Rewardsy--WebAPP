// merchant-config.js

import { getBaseURL, APICallHandler } from "./APIServices";

// Function to get all configs for a specific merchant by ID
export const getMerchantConfigs = async (merchantId) => {
  try {
    const url = `${getBaseURL()}/merchant-config/home/${merchantId}`; // Construct the API URL
    const response = await APICallHandler(url, 'GET'); // Call the API
    return response; // Return the configurations data
  } catch (error) {
    console.error(`Failed to fetch merchant configs: ${error.message}`);
    throw error; // Re-throw the error to be handled by the caller
  }
};
