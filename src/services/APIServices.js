export const getBaseURL = ()=>{
    return (import.meta.env.VITE_BACKEND_URL);
}

export const APICallHandler = async ( url, method, token=undefined,header, body=undefined) => {
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
  