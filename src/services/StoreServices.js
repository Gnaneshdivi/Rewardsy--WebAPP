import { getBaseURL, APICallHandler } from "./APIServices";

export const getStore = async (storeId) => {
  const url = getBaseURL() + `/store/${storeId}`;
  try {
    const data = await APICallHandler(url, "GET");
    return data;
  } catch (error) {
    throw error;
  }
};

export const getStoreByLocation = async (location) => {
  const url = getBaseURL() + `/store/by-location`;
  const headers = {"location": location}
  try {
    const data = await APICallHandler(url ,"GET", headers);
    // console.log(data);
    return data;
  } catch (error) {
    throw error;
  }
};