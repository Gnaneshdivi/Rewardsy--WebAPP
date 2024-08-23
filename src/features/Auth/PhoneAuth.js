import React, { useState, useEffect } from "react";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../../firebase";
import "./PhoneAuth.css"; // Ensure styles are set up for PhoneAuth
import { Link } from "react-router-dom";

const PhoneAuth = ({ onNumberSubmit }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);

  useEffect(() => {
    if (!recaptchaVerifier) {
      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
      setRecaptchaVerifier(verifier);
    }
  }, [recaptchaVerifier]);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Ensure phone number starts with a "+" and country code
    if (!phoneNumber.startsWith("+")) {
      console.error("Phone number must include a country code.");
      return;
    }

    if (recaptchaVerifier && phoneNumber) {
      signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
        .then((confirmationResult) => {
          onNumberSubmit(confirmationResult); // Pass confirmationResult to OTP step
        })
        .catch((error) => {
          console.error("Error during sign-in:", error);
        });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <h2>Login</h2>
        {/* <p>Get access to your Orders, Wishlist and Recommendations</p> */}
        <img
          className="illustration"
          src="/Login.png"
          alt="Login Illustration"
        />
      </div>
      <div className="auth-right">
        <form onSubmit={handleSubmit}>
          <label htmlFor="phone-number">Enter Mobile number</label>
          <input
            type="text"
            id="phone-number"
            name="phone-number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+916000000001"
            required
          />
          {/* <p>
            By continuing, you agree to our <a href="#">Terms of Use</a> and{" "}
            <a href="#">Privacy Policy</a>.
          </p> */}
          <button type="submit" className="submit-button">
            Request OTP
          </button>
        </form>
        <p className="create-account">
          New to the platform? <Link to="/signup">Create an account</Link>
        </p>
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default PhoneAuth;
