import React, { useState } from "react";
import "./Signup.css"; // Ensure styles are set up for Signup

const Signup = ({ onNumberSubmit }) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (phoneNumber) {
      onNumberSubmit(phoneNumber); // Call the onNumberSubmit function to handle OTP process
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <h2>Looks like you're new here!</h2>
        <p>Sign up with your mobile number to get started</p>
        <img src="/Login.png" alt="Signup Illustration" />
      </div>
      <div className="signup-right">
        <form onSubmit={handleSubmit}>
          <label htmlFor="phone-number">Enter Mobile number</label>
          <input
            type="number"
            id="phone-number"
            name="phone-number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <button type="submit" className="submit-button">
            Continue
          </button>
        </form>
        <button className="login-button">Existing User? Log in</button>
      </div>
    </div>
  );
};

export default Signup;
