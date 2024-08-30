// Signup.js
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
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import UserContext from "../../context/UserContext"; // Import the context

const Signup = () => {
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    state: "",
  });

  const navigate = useNavigate();
  const { setUserDetails } = useContext(UserContext); // Use context to set user details

  async function checkIfUserExists(phoneNumber) {
    try {
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("phoneNumber", "==", phoneNumber));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
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
        }
      );
    }
  }

  async function onSignup() {
    setLoading(true);

    const formatPh = "+" + ph; // Ensure phone number is formatted with country code
    const userExists = await checkIfUserExists(formatPh);

    if (userExists) {
      setLoading(false);
      toast.error("User already exists. Please log in.");
      navigate("/login");
      return;
    }

    onCaptchVerify();

    const SignupVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, formatPh, SignupVerifier)
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
      setUser(res.user);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error("Failed to verify OTP. Please try again.");
    }
  }

  const handleClose = () => {
    navigate("/home");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure user data is saved correctly in Firestore
      await setDoc(doc(db, "users", user.uid), {
        ...formData,
        phoneNumber: ph, // Save the phone number as well
        uid: user.uid, // Save the user ID from Firebase Auth
      });

      // Update context with user details
      setUserDetails({
        ...formData,
        uid: user.uid,
        phoneNumber: ph,
      });

      toast.success("Details submitted successfully!");
      navigate("/home"); // Redirect user after successful submission
    } catch (error) {
      console.error("Error saving user data:", error);
      toast.error("Failed to submit details. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center mt-10 relative">
      <div
        className="bg-gray-300 shadow-lg flex flex-col md:flex-row relative"
        style={{ width: "100%", maxWidth: "900px" }}
      >
        <button
          className="absolute top-4 right-4 text-black text-2xl"
          onClick={handleClose}
        >
          &times;
        </button>

        <div className="w-full md:w-1/3 bg-yellow-500 p-8 flex flex-col justify-center items-center">
          <h2 className="text-3xl text-white font-semibold mb-6 text-center">
            Looks like you're new here!
          </h2>
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
            <form onSubmit={handleFormSubmit} className="flex flex-col">
              <h2 className="text-center text-gray-800 font-medium text-2xl">
                Complete Your Profile
              </h2>
              <label htmlFor="name" className="text-gray-800 font-semibold">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="border-2 text-black border-gray-300 p-2 rounded-md focus:outline-none focus:border-yellow-500"
              />
              <label htmlFor="age" className="text-gray-800 font-semibold">
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                required
                className="border-2 text-black border-gray-300 p-2 rounded-md focus:outline-none focus:border-yellow-500"
              />
              <label htmlFor="email" className="text-gray-800 font-semibold">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="border-2 text-black border-gray-300 p-2 rounded-md focus:outline-none focus:border-yellow-500"
              />
              <label htmlFor="state" className="text-gray-800 font-semibold">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                className="border-2 text-black border-gray-300 p-2 rounded-md focus:outline-none focus:border-yellow-500"
              />
              <button
                type="submit"
                className="bg-black w-full py-3 text-yellow-500 rounded-md mt-4"
              >
                Submit
              </button>
            </form>
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
                    className="opt-container text-black border-2 border-black"
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
              <Link to="/login" className="mt-4">
                <button className="w-full text-gray-800 py-3 rounded-md border-2 font-medium hover:bg-gray-100">
                  Existing User? Log in
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
