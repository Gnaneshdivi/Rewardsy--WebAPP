import React, { useState } from "react";
import ProgressBar from "../ProgressBar";
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";
import PhoneAuth from "../../features/Auth/PhoneAuth";
import Signup from "../../features/Auth/Signup";
import OtpInput from "../../features/Auth/OtpInput";
import { auth, signInWithPhoneNumber } from "../../firebase"; // Import Firebase auth functions
import "./AuthModel.css";

const AuthModal = ({ isOpen, close, mode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null); // Store the Firebase confirmation result
  const totalSteps = mode === "signup" ? 3 : 2;

  // Handle phone number submission
  const handleNumberSubmit = (number) => {
    setPhoneNumber(number); // Save the phone number

    // Initiate Firebase Phone Authentication
    const appVerifier = new auth.RecaptchaVerifier("recaptcha-container", {
      size: "invisible",
    });

    signInWithPhoneNumber(auth, number, appVerifier)
      .then((confirmationResult) => {
        setConfirmationResult(confirmationResult); // Save confirmation result for OTP verification
        setCurrentStep(2); // Proceed to OTP step
      })
      .catch((error) => {
        console.error("Error during sign-in:", error);
        // Handle errors appropriately (e.g., display error message)
      });
  };

  // Handle OTP submission
  const handleOTPSubmit = (otp) => {
    if (confirmationResult) {
      confirmationResult
        .confirm(otp)
        .then((result) => {
          console.log("User signed in:", result.user);
          if (mode === "login") {
            close(); // Close modal after login is complete
            // Redirect to profile or handle logged-in state
          } else {
            setCurrentStep(3); // Proceed to the signup data step
          }
        })
        .catch((error) => {
          console.error("Error verifying OTP:", error);
          // Handle errors appropriately (e.g., display error message)
        });
    }
  };

  // Handle signup data submission
  const handleSignupSubmit = (signupData) => {
    console.log("Signup data submitted:", signupData);
    // Handle the signup process (e.g., saving additional data to your database)
    close(); // Close the modal after signup is complete
    // Redirect to profile or handle signed-up state
  };

  return (
    <Dialog
      isOpen={isOpen}
      onDismiss={() => {
        setCurrentStep(1);
        close();
      }}
      className="auth-modal"
    >
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

      {mode === "login" && (
        <>
          <h2>Login</h2>
          {currentStep === 1 && (
            <PhoneAuth onNumberSubmit={handleNumberSubmit} />
          )}
          {currentStep === 2 && <OtpInput onOTPSubmit={handleOTPSubmit} />}
          {currentStep === 3 && <div>Login Complete!</div>}
        </>
      )}

      {mode === "signup" && (
        <>
          <h2>Sign Up</h2>
          {currentStep === 1 && (
            <PhoneAuth onNumberSubmit={handleNumberSubmit} />
          )}
          {currentStep === 2 && <OtpInput onOTPSubmit={handleOTPSubmit} />}
          {currentStep === 3 && (
            <Signup
              phoneNumber={phoneNumber}
              onSignupSubmit={handleSignupSubmit}
            />
          )}
        </>
      )}
      <div id="recaptcha-container"></div>
    </Dialog>
  );
};

export default AuthModal;
