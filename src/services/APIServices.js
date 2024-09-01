export const getBaseURL = ()=>{
    return "http://localhost:5000";
}

export const APICallHandler = async ( url, method, token=undefined, body=undefined) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      };

      const response = await fetch(url, {
        method,
        headers,
        body
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
  