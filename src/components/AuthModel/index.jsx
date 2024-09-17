import React, { useState, useContext } from "react";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
import OtpInput from "otp-input-react";
import { auth, db } from "../../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import { Skeleton } from 'antd';

import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import UserContext from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { CgSpinner } from "react-icons/cg";
import "./AuthModel.css"; // Import the CSS file

const AuthModal = ({ isOpen, close }) => {
  const [step, setStep] = useState(1); // Step 1: Phone Input, Step 2: OTP Input, Step 3: Signup Details
  const [ph, setPh] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    state: "",
  });

  const { setUserDetails } = useContext(UserContext);
  const navigate = useNavigate();

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

  async function onPhoneSubmit() {
    setLoading(true);

    const userExists = await checkIfUserExists(ph);
    const formatPh = "+91" + ph;

    if (userExists) {
      onCaptchVerify();
      signInWithPhoneNumber(auth, formatPh, window.recaptchaVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          setLoading(false);
          setStep(2); 
          toast.success("OTP sent successfully!");
        })
        .catch((error) => {
          console.error("Failed to send OTP:", error);
          setLoading(false);
          toast.error("Failed to send OTP. Please try again.");
        });
    } else {
      onCaptchVerify();
      signInWithPhoneNumber(auth, formatPh, window.recaptchaVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          setLoading(false);
          setStep(2); 
          toast.success("OTP sent successfully!");
        })
        .catch((error) => {
          console.error("Failed to send OTP:", error);
          setLoading(false);
          toast.error("Failed to send OTP. Please try again.");
        });
    }
  }

  async function onOTPVerify() {
    setLoading(true);
    try {
      const res = await window.confirmationResult.confirm(otp);
      const uid = res.user.uid;
      setUser(res.user); 

      const userExists = await checkIfUserExists(ph);

      if (userExists) {
        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          userData.token = await auth.currentUser.getIdToken();
          setUserDetails(userData);
        }

        setLoading(false);
        toast.success("Login successful!");
        close(); 
        navigate("/home");
      } else {
        setStep(3); 
        setLoading(false);
      }
    } catch (err) {
      console.error("Failed to verify OTP:", err);
      setLoading(false);
      toast.error("Failed to verify OTP. Please try again.");
    }
  }

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
        token: await auth.currentUser.getIdToken(),
      });

      toast.success("Details submitted successfully!");
      close();
      navigate("/home");
    } catch (error) {
      console.error("Error saving user data:", error);
      toast.error("Failed to submit details. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal">
      <Skeleton toastOptions={{ duration: 4000 }} />
      <div className="modal-content">
        <div className="hidden" id="recaptcha-container"></div>

        {step === 1 && (
          <div className="login-signUp-div">
            <div className="login-signUp-text-div">
              <div>
                <h1>Get <br></br> Started</h1>
              </div>
              <div className="login-signUp-text-para-div">
                <p>saving cannot get anymore easier</p>
                <p>Sign Up and start saving right now</p>
              </div>
            </div>

            <div className="divider-div"></div>

            <div className="login-signUp-function-div">
              <h1 className="">LOGIN / SIGNUP</h1>
              <div>
                <div className="phone-input-container">
                  <input
                    type="tel"
                    value={ph}
                    onChange={(e) => setPh(e.target.value)}
                    style={{}}
                    placeholder="Mobile No"
                    required
                    maxLength={10}
                  />
                </div>
                {/* <div className="login-signUp-signin-div">
                  <span>Already have an account ?</span>
                  <a>sign in</a>
                </div> */}
              </div>
              <div className="login-signUp-otp-div">
                <button
                  onClick={onPhoneSubmit}
                  className="submit-button flex gap-1 items-center justify-center mt-10 py-2.5"
                >
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Request OTP</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className=" step2 ">
            <h1 className="text-center text-black font-semibold text-3xl">
              VERIFY OTP
            </h1>
            <input
              type="number"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              autoFocus
              style={{}}
              disabled={false}
              required
              placeholder="enter your OTP"
            />

            <button
              onClick={onOTPVerify}
              className="submit-button flex mt-10 gap-1 items-center justify-center py-2.5"
            >
              {loading && <CgSpinner size={20} className="mt-1 animate-spin" />}
              <span>Verify OTP</span>
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="login-signUp-div">
          <div className="login-signUp-text-div">
            <div>
              <h1>Get <br></br> Started</h1>
            </div>
            <div className="login-signUp-text-para-div">
              <p>saving cannot get anymore easier</p>
              <p>Sign Up and start saving right now</p>
            </div>
          </div>

          <div className="divider-div divider-signup-div"></div>

            <form onSubmit={handleFormSubmit} className="signup-form-div">
              <div className="signup-caption-div">
                <h1>
                  Complete Your Profile
                </h1>
              </div>
              <div className="signup-input-div">
                <input
                  placeholder="Name"
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  minLength={3} 
                  className="form-input"
                />
                <input
                  placeholder="Age"
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                  min={1}
                  max={100} 
                  className="form-input"
                />
                <input
                  placeholder="Email"
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
                <input
                  placeholder="State"
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
                <div className="terms-conditions">
                  <label htmlFor="termsAccepted">agreeing to all T&C*</label>
                  <input
                    type="checkbox"
                    id="termsAccepted"
                    name="termsAccepted"
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="signup-button-div">
                <button
                  type="submit"
                  className="signup-submit-button"
                  disabled={loading}
                >
                  {loading ? (
                    <CgSpinner size={20} className="animate-spin" />
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        <button onClick={close} className="close-button">
          X
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
