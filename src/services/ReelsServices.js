import { getBaseURL, APICallHandler } from "./apiServices";

export const getReels = async() => {
  const url = getBaseURL() + "/reels";
  try {
    const data = await APICallHandler(url, "GET");
    return data;
  } catch (error) {
    throw error;
  }
};

export const getReelsByStore = async (storeId) => {
  const url = getBaseURL() + `/reels/by-store/${storeId}`;
  try {
    const data = await APICallHandler(url, "GET" );
    return data;
  } catch (error) {
    throw error;
  }
};
