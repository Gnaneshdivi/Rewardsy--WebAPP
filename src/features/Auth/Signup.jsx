import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import OtpInput from "otp-input-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth, db } from "../../firebase";
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
import UserContext from "../../context/UserContext";

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
  const { setUserDetails } = useContext(UserContext);

  async function checkIfUserExists(phoneNumber) {
    try {
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("phoneNumber", "==", phoneNumber));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking if user exists:", error);
      return false;
    }
  }

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => onSignup(),
        }
      );
    }
  }

  async function onSignup() {
    setLoading(true);

    const formatPh = "+" + ph;
    const userExists = await checkIfUserExists(formatPh);

    if (userExists) {
      setLoading(false);
      toast.error("User already exists. Please log in.");
      navigate("/login");
      return;
    }

    onCaptchVerify();

    signInWithPhoneNumber(auth, formatPh, window.recaptchaVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success("OTP sent successfully!");
      })
      .catch((error) => {
        console.error("Failed to send OTP:", error);
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
      console.error("Failed to verify OTP:", err);
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
    if (!user) {
      toast.error("Please complete OTP verification first.");
      return;
    }

    try {
      await setDoc(doc(db, "users", user.uid), {
        ...formData,
        phoneNumber: ph,
        uid: user.uid,
      });

      setUserDetails({
        ...formData,
        uid: user.uid,
        phoneNumber: ph,
      });

      toast.success("Details submitted successfully!");
      navigate("/home");
    } catch (error) {
      console.error("Error saving user data:", error);
      toast.error("Failed to submit details. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center mt-1 h-screen">
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
            Get Started
          </h2>
          <h4 className="text-base sm:text-lg md:text-2xl text-black mt-2">
            Saving cannot get any more easier. Sign-up and start saving right
            now.
          </h4>
        </div>
        <div className="m-2 bg-black w-1"></div>
        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center">
          <Toaster toastOptions={{ duration: 4000 }} />
          <div className="hidden" id="recaptcha-container"></div>
          {user ? (
            <form onSubmit={handleFormSubmit} className="flex flex-col">
              <h2 className="text-center font-semibold text-black text-2xl">
                Complete Your Profile
              </h2>
              <label htmlFor="name" className="font-bold text-lg text-black">
                Name
              </label>
              <input
                placeholder="Name"
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="border-2 text-black border-black bg-[#FFEA35] placeholder:text-[#55501cbb] p-2 rounded-md focus:outline-none focus:border-yellow-500 w-full"
              />
              <label htmlFor="age" className="font-bold text-lg text-black">
                Age
              </label>
              <input
                placeholder="10"
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                required
                className="border-2 text-black border-black bg-[#FFEA35] placeholder:text-[#55501cbb] p-2 rounded-md focus:outline-none focus:border-yellow-500 w-full"
              />
              <label htmlFor="email" className="font-bold text-lg text-black">
                Email
              </label>
              <input
                placeholder="email@gmail.com"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="border-2 text-black border-black bg-[#FFEA35] placeholder:text-[#55501cbb] p-2 rounded-md focus:outline-none focus:border-yellow-500 w-full"
              />
              <label htmlFor="state" className="font-bold text-lg text-black">
                State
              </label>
              <input
                placeholder="Andhra Pradesh"
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                className="border-2 text-black border-black bg-[#FFEA35] placeholder:text-[#55501cbb] p-2 rounded-md focus:outline-none focus:border-yellow-500 w-full"
              />
              <button
                type="submit"
                className="bg-black w-full py-3 text-[#FFEA35] rounded-md mt-4"
                disabled={loading}
              >
                {loading ? (
                  <CgSpinner size={20} className="animate-spin" />
                ) : (
                  "Submit"
                )}
              </button>
            </form>
          ) : (
            <div className="flex flex-col gap-3 sm:p-6">
              <h1 className="text-center text-black font-semibold mb-4 text-3xl sm:text-5xl">
                SIGNUP
              </h1>
              {showOTP ? (
                <>
                  {/* <div className="bg-[#f7e22b] text-white w-fit mx-auto p-4 rounded-full">
                    <BsFillShieldLockFill size={30} />
                  </div> */}
                  <label
                    htmlFor="otp"
                    className="font-bold text-xl text-black text-center"
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
                    <button onClick={onSignup} className="text-blue-700">
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
                    Already have a account ?
                    <Link to="/login" className="text-blue-700">
                      Log in
                    </Link>
                  </p>
                  <button
                    onClick={onSignup}
                    className="bg-black w-full flex gap-1 items-center justify-center mt-10 py-2.5 text-[#FFEA35] rounded"
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

export default Signup;
