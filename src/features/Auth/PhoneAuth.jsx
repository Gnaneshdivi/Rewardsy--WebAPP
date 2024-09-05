import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
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

  async function checkIfUserExists(uid) {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      return userDoc.exists(); // Return true if user data exists in Firestore
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

    // Firebase Auth phone number sign-in
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

      const uid = res.user.uid; // Get the UID of the logged-in user

      // Check if the user exists in Firestore
      const userExists = await checkIfUserExists(uid);

      if (userExists) {
        // Fetch user data from Firestore
        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          userData.token = await auth.currentUser.getIdToken();
          setUserDetails(userData); // Set user data in context
        }

        setUser(res.user);
        setLoading(false);
        toast.success("Login successful!");
        navigate("/home");
      } else {
        setLoading(false);
        toast.error("User not found. Redirecting to Signup.");
        navigate("/signup");
      }
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
    <div className="flex items-center justify-center mt-1 h-screen sm:h-96">
      <div className="bg-[#FFEA35] shadow-lg flex flex-col md:flex-row w-full max-w-lg sm:max-w-2xl md:max-w-4xl relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-black text-2xl"
          onClick={handleClose}
        >
          &times;
        </button>

        <div className="w-full md:w-1/2 bg-[#FFEA35] p-8 flex flex-col justify-center items-center">
          <h2 className="text-4xl sm:text-4xl md:text-6xl text-black font-semibold">
            Welcome Back
          </h2>
          <h4 className="text-base sm:text-lg md:text-2xl text-black mt-2">
            Saving cannot get any more easier. Sign-in and start saving right
            now.
          </h4>
        </div>
        <div className="m-2 bg-black w-1"></div>
        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center">
          <Toaster toastOptions={{ duration: 4000 }} />
          <div className="hidden" id="recaptcha-container"></div>
          {user ? (
            <h2 className="text-center text-black font-medium text-2xl">
              👍 Login Success
            </h2>
          ) : (
            <div className="flex flex-col gap-3 sm:p-6">
              <h1 className="text-center text-black font-semibold text-3xl sm:text-5xl">
                LOGIN
              </h1>
              {showOTP ? (
                <>
                  {/* <div className="bg-[#f7e22b] text-white w-fit mx-auto p-4 rounded-full">
                    <BsFillShieldLockFill size={30} />
                  </div> */}
                  <label
                    htmlFor="otp"
                    className="font-bold text-lg text-black text-center"
                  >
                    Enter your OTP
                  </label>
                  <div className="flex justify-center items-center">
                    <OtpInput
                      value={otp}
                      onChange={setOtp}
                      OTPLength={6}
                      otpType="number"
                      disabled={false}
                      autoFocus
                      inputStyles={{
                        borderRadius: "4px",
                        color: "black",
                        width: "32px",
                        height: "32px",
                        textAlign: "center",
                        marginRight: "8px",
                        backgroundColor: "#FFEA35", // Yellow background
                        border: "2px solid black", // Black border
                      }}
                    />
                  </div>
                  <p className="text-xs mt-3 text-black text-center">
                    Did not receive OTP?{" "}
                    <button
                      onClick={onSignup}
                      to="/signup"
                      className="text-blue-700"
                    >
                      Resend OTP
                    </button>
                  </p>
                  <button
                    onClick={onOTPVerify}
                    className="bg-black w-full flex mt-10 gap-1 items-center justify-center py-2.5 text-white rounded"
                  >
                    {loading && (
                      <CgSpinner size={20} className="mt-1 animate-spin" />
                    )}
                    <span>Verify OTP</span>
                  </button>
                </>
              ) : (
                <>
                  {/* <div className="bg-[#f7e22b] text-white w-fit mx-auto p-4 rounded-full">
                    <BsTelephoneFill size={30} />
                  </div> */}
                  <label
                    htmlFor=""
                    className="font-bold text-lg text-black text-center"
                  >
                    {/* Enter Mobile number */}
                  </label>
                  <div className="custom-phone-input">
                    <PhoneInput
                      country={"in"}
                      value={ph}
                      onChange={setPh}
                      buttonStyle={{
                        backgroundColor: "#FFEA35",
                        border: "2px solid black",
                        borderRight: "transparent",
                        borderEndStartRadius: "8px",
                        borderTopLeftRadius: "8px",
                        color: "black", // Make the country name black
                        cursor: "default", // Prevent hover effects
                      }}
                      inputStyle={{
                        border: "2px solid black",
                        backgroundColor: "#FFEA35",
                        width: "100%",
                        borderRadius: "8px",
                        height: "3rem",
                        fontSize: "1rem",
                        color: "black", // Keep the text color black
                      }}
                      containerStyle={{
                        backgroundColor: "#FFEA35",
                      }}
                    />
                  </div>
                  <p className="text-xs mt-3 text-black text-center">
                    New to the platform?{" "}
                    <Link to="/signup" className="text-blue-700">
                      Create an account
                    </Link>
                  </p>
                  <button
                    onClick={onSignup}
                    className="bg-black w-full flex gap-1 items-center justify-center mt-10 py-2.5 text-white rounded"
                  >
                    {loading && (
                      <CgSpinner size={20} className="mt-1 animate-spin" />
                    )}
                    <span>Request OTP</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhoneAuth;
