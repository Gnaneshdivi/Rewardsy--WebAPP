import React, { useState } from "react";
import ProgressBar from "../ProgressBar";
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";
import PhoneAuth from "../../features/Auth/PhoneAuth";
import Signup from "../../features/Auth/Signup";
import "./AuthModel.css";

const AuthModal = ({ isOpen, close, mode }) => {
  return (
    <Dialog isOpen={isOpen} className="auth-modal">
      {/* <ProgressBar currentStep={currentStep} totalSteps={totalSteps} /> */}

      {mode === "login" && (
        <>
          <PhoneAuth />
        </>
      )}

      {mode === "signup" && (
        <>
          <Signup />
        </>
      )}
    </Dialog>
  );
};

export default AuthModal;
