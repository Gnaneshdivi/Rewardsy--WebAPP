import React, { useState, useEffect } from "react";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../../firebase";
import "./PhoneAuth.css"; // Ensure styles are set up for PhoneAuth

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
    <div className="phone-auth-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="phone-number">Phone Number:</label>
        <input
          type="text"
          id="phone-number"
          name="phone-number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+916000000001" // Guide user with a placeholder
          required
        />
        <button type="submit" className="submit-button">
          Send OTP
        </button>
      </form>
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default PhoneAuth;
