// src/context/UserContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth"; // Import the listener for auth state
import { auth } from "../firebase"; // Import your Firebase auth instance

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true); // To handle the loading state initially

  const clearUserDetails = () => {
    setUserDetails(null);
    // Sign out from Firebase auth if you want to clear user details
    auth.signOut().catch((error) => console.error("Error signing out:", error));
  };

  useEffect(() => {
    // Listen for changes in the user's authentication state
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, retrieve user details
        const token = await user.getIdToken();
        setUserDetails({
          uid: user.uid,
          email: user.email,
          token: token,
          // Add more user information here if needed
        });
      } else {
        // User is signed out
        setUserDetails(null);
      }
      setLoading(false); // Set loading to false once the auth state is determined
    });

    // Clean up the subscription on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider
      value={{ userDetails, setUserDetails, clearUserDetails, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
