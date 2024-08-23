import React, { useState } from "react";

const OTPInput = ({ confirmationResult, onOTPSubmit }) => {
  const [otp, setOtp] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (confirmationResult) {
      confirmationResult
        .confirm(otp)
        .then((result) => {
          // User signed in successfully.
          onOTPSubmit(result.user);
        })
        .catch((error) => {
          console.error("Error verifying OTP:", error);
        });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="otp">OTP:</label>
      <input
        type="text"
        id="otp"
        name="otp"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
      />
      <button type="submit">Verify OTP</button>
    </form>
  );
};

export default OTPInput;
