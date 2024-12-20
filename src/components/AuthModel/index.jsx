import React, { useState, useContext, useEffect } from "react";
import { auth, db } from "../../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { CgSpinner } from "react-icons/cg";
import "./AuthModel.css";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../../slices/userSlice";
import { Flex, Input, Typography } from "antd";

const AuthModal = ({ isOpen, close }) => {
  const [step, setStep] = useState(1);
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

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userDetails = useSelector((state) => state.user.userDetails);

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
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
            callback: (response) => {
              console.log("reCAPTCHA verified:", response);
            },
            "expired-callback": () => {
              console.warn("reCAPTCHA expired. Please try again.");
            },
          }
        );
      } catch (error) {
        console.error("Error initializing reCAPTCHA verifier:", error);
      }
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
    console.log(otp);
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
          dispatch(setUserDetails(userData));
        }

        setLoading(false);
        toast.success("Login successful!");
        close();
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

      dispatch(
        setUserDetails({
          ...formData,
          uid: user.uid,
          phoneNumber: ph,
          token: await auth.currentUser.getIdToken(),
        })
      );

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

  const onChange = (text) => {
    console.log("onChange:", text);
  };

  const sharedProps = {
    onChange,
  };

  return (
    <div className="auth-modal">
      <Toaster toastOptions={{ duration: 4000 }} />
      <div className="modal-content">
        <div className="hidden" id="recaptcha-container"></div>

        {step === 1 && (
          <div className="login-signUp-div">
            <div className="login-signUp-text-div">
              <div>
                <h1>
                  Get <br /> Started
                </h1>
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
                    type="number"
                    value={ph}
                    onChange={(e) => setPh(e.target.value)}
                    placeholder="Mobile No"
                    required
                    maxLength={10}
                  />
                </div>
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

            <Input.OTP
              formatter={(str) => str.toUpperCase()}
              // {...sharedProps}
              value={otp}
              onChange={(e) => {
                setOtp(e);
                // console.log(e)
              }}
              // disabled={false}
              required
            />
            <button onClick={onOTPVerify} className="submit-button-step2">
              {loading && <CgSpinner size={20} className="mt-1 animate-spin" />}
              Verify OTP
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="login-signUp-div" style={{ minHeight: "55vh" }}>
            <div className="login-signUp-text-div">
              <div>
                <h1>
                  Get <br /> Started
                </h1>
              </div>
              <div className="login-signUp-text-para-div">
                <p>saving cannot get anymore easier</p>
                <p>Sign Up and start saving right now</p>
              </div>
            </div>
            <div className="divider-div"></div>

            <form onSubmit={handleFormSubmit} className="signup-form-div">
              <div className="label">
                {/* <label>Name</label> */}
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
              </div>
              <div className="label">
                {/* <label>Age</label> */}
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
              </div>
              <div className="label">
                {/* <label>Email</label> */}
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
              </div>
              <div className="label">
                {/* <label>State</label> */}
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
              </div>
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
