import { getBaseURL, APICallHandler } from "./APIServices";

export const getOffersByStore = async (storeId) => {
  const url = getBaseURL() + `/offers/by-store/${storeId}`;
  try {
    const data = await APICallHandler(url, "GET");
    return data;
  } catch (error) {
    throw error;
  }
};

export const getOffers = async() => {
  const url = getBaseURL() + "/offers";
  try {
    const data = await APICallHandler(url, "GET");
    return data;
  } catch (error) {
    throw error;
  }
};

export const redeemOffers = async (orderId, userId, token) => {
  const url = getBaseURL() + `/offers/${orderId}/apply`;
  const body = { userId, orderId };
  try {
    const data = await APICallHandler(url, "POST", token, body);
    return data;
  } catch (error) {
    throw error;
  }
};
