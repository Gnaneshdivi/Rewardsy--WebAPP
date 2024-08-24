import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupDetails.css"; // Ensure styles are set up for SignupDetails

const SignupDetails = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const userDetails = { name, email, state };
    // Call the onSubmit function with the user's details
    onSubmit(userDetails);
  };

  const handleClose = () => {
    navigate("/home"); // Navigate to home when close button is clicked
  };

  return (
    <div className="signup-details-container">
      <button className="close-button" onClick={handleClose}>
        X
      </button>
      <div className="signup-left">
        <h2>Looks like you're new here!</h2>
        <p>Complete your signup by filling in the details below.</p>
        <img src="/Login.png" alt="Signup Illustration" />
      </div>
      <div className="signup-right">
        <h2>Complete Your Signup</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupDetails;
