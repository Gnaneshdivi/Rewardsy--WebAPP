import React, { createContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);

  const clearUserDetails = () => setUserDetails(null);

  return (
    <UserContext.Provider
      value={{ userDetails, setUserDetails, clearUserDetails }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
