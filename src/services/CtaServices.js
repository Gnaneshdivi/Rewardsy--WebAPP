import { getBaseURL, APICallHandler } from "./APIServices";

export const getCta = async (ctaId,token) => {
  const url = getBaseURL() + `/cta/${ctaId}`;
  try {
    const data = await APICallHandler(url, "GET",token);
    return data;
  } catch (error) {
    throw error;
  }


  
};

export const updateCta = async (ctaId, token, updateData) => {
  const url = getBaseURL() + `/cta/${ctaId}`;
  try {
    const data = await APICallHandler(url, "POST", token, "",updateData);
    return data;
  } catch (error) {
    throw error;
  }
};
