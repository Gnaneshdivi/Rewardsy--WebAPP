// src/pages/Payment.js
import React, { useEffect } from "react";

const Payment = () => {
  useEffect(() => {
    const fetchMapping = async () => {
      // Log the origin and referrer for debugging
      console.log("Origin:", window.location.origin); 
      console.log("Referrer:", document.referrer); // This shows the previous page that referred to this one

      // Redirect to the UPI payment URL
      window.location.href =
        "gpay://pay?pa=suryatej01234@ibl&pn=surya%20teja&mc=0000&mode=02&purpose=00";
    };

    fetchMapping();
  }, []);

  return <></>;
};

export default Payment;
