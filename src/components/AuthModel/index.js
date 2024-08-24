import React, { useState } from "react";
import ProgressBar from "../ProgressBar";
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";
import PhoneAuth from "../../features/Auth/PhoneAuth";
import Signup from "../../features/Auth/Signup";
import OtpInputs from "../../features/Auth/OtpInput";
import OtpInputSignUp from "../../features/Auth/OtpInputSignUp";
import SignupDetails from "../../features/Auth/SignupDetails";
import { auth, signInWithPhoneNumber } from "../../firebase"; // Import Firebase auth functions
import "./AuthModel.css";

const AuthModal = ({ isOpen, close, mode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null); // Store the Firebase confirmation result
  const totalSteps = mode === "signup" ? 3 : 2;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle phone number submission
  const handleNumberSubmit = (number) => {
    setPhoneNumber(number); // Save the phone number
    setLoading(true);
    setError(null);

    try {
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
          setError("Failed to send OTP. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  // Handle OTP submission
  const handleOTPSubmit = (otp) => {
    if (confirmationResult) {
      setLoading(true);
      setError(null);
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
          setError("Invalid OTP. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
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
      {/* <ProgressBar currentStep={currentStep} totalSteps={totalSteps} /> */}

      {mode === "login" && (
        <>
          {currentStep === 1 && (
            <PhoneAuth
              onNumberSubmit={handleNumberSubmit}
              loading={loading}
              error={error}
            />
          )}
          {currentStep === 2 && (
            <OtpInputs
              onOTPSubmit={handleOTPSubmit}
              loading={loading}
              error={error}
            />
          )}
          {currentStep === 3 && <div>Login Complete!</div>}
        </>
      )}

      {mode === "signup" && (
        <>
          {currentStep === 1 && (
            <Signup
              onNumberSubmit={handleNumberSubmit}
              loading={loading}
              error={error}
            />
          )}
          {currentStep === 2 && (
            <OtpInputSignUp
              onOTPSubmit={handleOTPSubmit}
              loading={loading}
              error={error}
            />
          )}
          {currentStep === 3 && <SignupDetails />}
        </>
      )}
      <div id="recaptcha-container"></div>
    </Dialog>
  );
};

export default AuthModal;
