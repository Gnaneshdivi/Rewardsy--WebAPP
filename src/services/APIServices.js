export const getBaseURL = ()=>{
    return "https://rewardsy-dev-backend-api-duhwf8eue9a0a9gk.centralindia-01.azurewebsites.net";
    //  return "http://localhost:3000";
}

export const APICallHandler = async ( url, method,  header, token=undefined, body=undefined) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...(header && {header})
      };

      const response = await fetch(url, {
        method,
        headers,
        body : JSON.stringify(body)
      });
      // console.log(body)
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw error; 
    }
  };
  