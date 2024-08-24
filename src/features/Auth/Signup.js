import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import "./Signup.css"; // Ensure styles are set up for Signup

const Signup = ({ onNumberSubmit }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = (event) => {
    event.preventDefault();
    if (phoneNumber) {
      onNumberSubmit(phoneNumber); // Call the onNumberSubmit function to handle OTP process
    }
  };

  const handleClose = () => {
    navigate("/home"); // Navigate to home when close button is clicked
  };

  return (
    <div className="signup-container">
      <button className="close-button" onClick={handleClose}>
        X
      </button>
      <div className="signup-left">
        <h2>Looks like you're new here!</h2>
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
        <Link to="/login">
          <button className="login-button">Existing User? Log in</button>
        </Link>
      </div>
    </div>
  );
};

export default Signup;
