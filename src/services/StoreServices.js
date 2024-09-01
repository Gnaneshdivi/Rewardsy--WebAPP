import { getBaseURL, APICallHandler } from "./apiServices";

export const getStore = async (storeId) => {
  const url = getBaseURL() + `/store/${storeId}`;
  try {
    const data = await APICallHandler(url, "GET");
    return data;
  } catch (error) {
    throw error;
  }
};
