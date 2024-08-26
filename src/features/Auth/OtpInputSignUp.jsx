import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import "./OtpInputSignUp.css"; // Ensure styles are set up for OtpInputSignUp

const OtpInputSignUp = ({ confirmationResult, onOTPSubmit }) => {
  const [otp, setOtp] = useState("");
  const location = useLocation(); // Hook to access location state
  const navigate = useNavigate();
  const phoneNumber = location.state?.phoneNumber; // Access the phone number passed from Signup

  const handleSubmit = (event) => {
    event.preventDefault();
    if (confirmationResult) {
      confirmationResult
        .confirm(otp)
        .then((result) => {
          // User signed in successfully.
          onOTPSubmit(result.user);
          navigate("/profile"); // Navigate to profile or other page after successful OTP verification
        })
        .catch((error) => {
          console.error("Error verifying OTP:", error);
          // Handle errors appropriately (e.g., display error message)
        });
    }
  };

  const handleClose = () => {
    navigate("/home"); // Navigate to home when close button is clicked
  };

  return (
    <div className="otp-container">
      <button className="close-button" onClick={handleClose}>
        X
      </button>
      <div className="otp-left">
        <h2>Enter OTP</h2>
        <p>We have sent an OTP to {phoneNumber}</p>
        <img src="/Login.png" alt="Otp Illustration" />
      </div>
      <div className="otp-right">
        <form onSubmit={handleSubmit}>
          <label htmlFor="otp">Enter OTP</label>
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            // renderSeparator={<span>-</span>}
            renderInput={(props) => (
              <input {...props} className="otp-input-box" />
            )}
          />
          <button type="submit" className="submit-button">
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpInputSignUp;
