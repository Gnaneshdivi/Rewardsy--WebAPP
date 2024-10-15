import { getBaseURL, APICallHandler } from "./APIServices";
export const getQRDetails = async (qrId) => {
    try {
      const url = `${getBaseURL()}/qr/${qrId}`; // Construct the API URL
      const response = await APICallHandler(url, 'GET'); // Call the API
      return response; // Return the QR details
    } catch (error) {
      console.error(`Failed to fetch QR details: ${error.message}`);
      throw error; // Re-throw the error to be handled by the caller
    }
  }