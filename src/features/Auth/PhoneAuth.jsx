// PhoneAuth.js
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import OtpInput from "otp-input-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth, db } from "../../firebase"; // Ensure db is imported to access Firestore
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import UserContext from "../../context/UserContext"; // Import the context
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions here

const PhoneAuth = () => {
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { setUserDetails } = useContext(UserContext); // Use context to set user details

  async function checkIfUserExists(phoneNumber) {
    try {
      const signInMethods = await fetchSignInMethodsForEmail(
        auth, // Use the already initialized auth object
        phoneNumber + "@phone.auth"
      );
      return signInMethods.length > 0;
    } catch (error) {
      console.error("Error checking if user exists:", error);
      return false; // If an error occurs, assume the user does not exist
    }
  }

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {},
        }
      );
    }
  }

  async function onSignup() {
    setLoading(true);
    onCaptchVerify();

    const formatPh = "+" + ph;
    const userExists = await checkIfUserExists("abc@gmail.com");

    console.log(userExists, "user exists");
    if (!userExists) {
      setLoading(false);
      // toast.error("Phone number is not registered. Redirecting to Signup.");
      alert("Phone number is not registered. Redirecting to Signup.");
      navigate("/signup");
      return;
    }

    signInWithPhoneNumber(auth, formatPh, window.recaptchaVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success("OTP sent successfully!");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        toast.error("Failed to send OTP. Please try again.");
      });
  }

  async function onOTPVerify() {
    setLoading(true);
    try {
      const res = await window.confirmationResult.confirm(otp);

      // Fetch user data from Firestore
      const userDocRef = doc(db, "users", res.user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserDetails(userData); // Set user data in context
      }

      setUser(res.user);
      setLoading(false);
      toast.success("Login successful!");
      navigate("/home");
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error("Failed to verify OTP. Please try again.");
    }
  }

  const handleClose = () => {
    navigate("/home");
  };

  return (
    <div className="flex items-center justify-center mt-10 relative">
      <div
        className="bg-gray-300 shadow-lg flex flex-col md:flex-row relative"
        style={{ width: "100%", maxWidth: "900px" }}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-black text-2xl"
          onClick={handleClose}
        >
          &times;
        </button>

        <div className="w-full md:w-1/3 bg-yellow-500 p-8 flex flex-col justify-center items-center">
          <h2 className="text-3xl text-white font-semibold">Login</h2>
          <img
            src="/Login.png"
            alt="Illustration"
            className="mb-6"
            style={{ maxWidth: "250px" }}
          />
        </div>
        <div className="flex-1 p-8 flex flex-col justify-center">
          <Toaster toastOptions={{ duration: 4000 }} />
          <div id="recaptcha-container"></div>
          {user ? (
            <h2 className="text-center text-gray-800 font-medium text-2xl">
              👍 Login Success
            </h2>
          ) : (
            <div className="flex flex-col gap-4 m-auto">
              <h1 className="text-center text-gray-800 font-medium text-xl">
                Enter Mobile number
              </h1>
              {showOTP ? (
                <>
                  <div className="bg-yellow-500 text-white w-fit mx-auto p-4 rounded-full">
                    <BsFillShieldLockFill size={30} />
                  </div>
                  <label
                    htmlFor="otp"
                    className="font-bold text-lg text-gray-800 text-center"
                  >
                    Enter your OTP
                  </label>
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    OTPLength={6}
                    otpType="number"
                    disabled={false}
                    autoFocus
                    className="opt-container text-black"
                  ></OtpInput>
                  <button
                    onClick={onOTPVerify}
                    className="bg-black w-full flex gap-1 items-center justify-center py-2.5 text-yellow-500 rounded"
                  >
                    {loading && (
                      <CgSpinner size={20} className="mt-1 animate-spin" />
                    )}
                    <span>Verify OTP</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="bg-yellow-500 text-white w-fit mx-auto p-4 rounded-full">
                    <BsTelephoneFill size={30} />
                  </div>
                  <label
                    htmlFor=""
                    className="font-bold text-lg text-gray-800 text-center"
                  >
                    Enter Mobile number
                  </label>
                  <PhoneInput
                    country={"in"}
                    value={ph}
                    onChange={setPh}
                    inputStyle={{
                      width: "100%",
                      borderRadius: "4px",
                      height: "3rem",
                      fontSize: "1rem",
                    }}
                  />
                  <button
                    onClick={onSignup}
                    className="bg-black w-full flex gap-1 items-center justify-center py-2.5 text-yellow-500 rounded"
                  >
                    {loading && (
                      <CgSpinner size={20} className="mt-1 animate-spin" />
                    )}
                    <span>Request OTP</span>
                  </button>
                </>
              )}
              <p className="text-gray-800 text-center mt-4">
                New to the platform?{" "}
                <Link to="/signup" className="text-yellow-500">
                  Create an account
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhoneAuth;
