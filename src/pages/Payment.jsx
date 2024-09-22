// src/pages/Payment.js
import React, { useEffect } from "react";

const Payment = () => {
  useEffect(() => {
    const fetchMapping = async () => {
      window.location.href =
        "upi://pay?pa=suryatej01234@ibl&pn=surya%20teja&mc=0000&mode=02&purpose=00";
    };

    fetchMapping();
  }, []);

  return <></>;
};

export default Payment;
