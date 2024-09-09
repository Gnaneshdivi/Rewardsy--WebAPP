export const getBaseURL = ()=>{
    return "https://rewardsy-dev-api-gmf5dbhcced2c0a0.eastus-01.azurewebsites.net";
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
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw error; 
    }
  };
  