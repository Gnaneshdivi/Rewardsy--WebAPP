import React, { useState, useContext } from "react";
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import OtpInput from "otp-input-react";
import { auth, db } from "../../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import UserContext from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { CgSpinner } from "react-icons/cg";

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

  // Check if the user exists
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

  // Handle phone number submission
  async function onPhoneSubmit() {
    setLoading(true);
    
    const userExists = await checkIfUserExists(ph);
    const formatPh = "+" + ph;

    if (userExists) {
      // If user exists, proceed with OTP for login
      onCaptchVerify();
      signInWithPhoneNumber(auth, formatPh, window.recaptchaVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          setLoading(false);
          setStep(2); // Move to OTP Input step
          toast.success("OTP sent successfully!");
        })
        .catch((error) => {
          console.error("Failed to send OTP:", error);
          setLoading(false);
          toast.error("Failed to send OTP. Please try again.");
        });
    } else {
      // If user does not exist, proceed with OTP for signup
      onCaptchVerify();
      signInWithPhoneNumber(auth, formatPh, window.recaptchaVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          setLoading(false);
          setStep(2); // Move to OTP Input step
          toast.success("OTP sent successfully!");
        })
        .catch((error) => {
          console.error("Failed to send OTP:", error);
          setLoading(false);
          toast.error("Failed to send OTP. Please try again.");
        });
    }
  }

  // Handle OTP verification
  async function onOTPVerify() {
    setLoading(true);
    try {
      const res = await window.confirmationResult.confirm(otp);
      const uid = res.user.uid;
      setUser(res.user); // Save the user to state

      // Check if the user exists in Firestore
      const userExists = await checkIfUserExists(ph);

      if (userExists) {
        // Fetch user data from Firestore
        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          userData.token = await auth.currentUser.getIdToken();
          setUserDetails(userData); // Set user data in context
        }

        setLoading(false);
        toast.success("Login successful!");
        close(); // Close modal if the user exists
        navigate("/home");
      } else {
        setStep(3); // Move to Signup Details step
        setLoading(false);
      }
    } catch (err) {
      console.error("Failed to verify OTP:", err);
      setLoading(false);
      toast.error("Failed to verify OTP. Please try again.");
    }
  }

  // Handle user details submission for new user
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
      close(); // Close modal after successful signup
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

  return (
    <Dialog isOpen={isOpen} className="auth-modal flex justify-center items-center h-screen">
      <Toaster toastOptions={{ duration: 4000 }} />
      <div className="hidden" id="recaptcha-container"></div>

      {step === 1 && (
        <div className="flex flex-col gap-3 sm:p-6">
          <h1 className="text-center text-black font-semibold text-3xl sm:text-5xl">LOGIN / SIGNUP</h1>
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
                color: "black",
                cursor: "default",
              }}
              inputStyle={{
                border: "2px solid black",
                backgroundColor: "#FFEA35",
                width: "100%",
                borderRadius: "8px",
                height: "3rem",
                fontSize: "1rem",
                color: "black",
              }}
              containerStyle={{
                backgroundColor: "#FFEA35",
              }}
            />
          </div>
          <button onClick={onPhoneSubmit} className="bg-black w-full flex gap-1 items-center justify-center mt-10 py-2.5 text-white rounded">
            {loading && <CgSpinner size={20} className="mt-1 animate-spin" />}
            <span>Request OTP</span>
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-3 sm:p-6">
          <h1 className="text-center text-black font-semibold text-3xl sm:text-5xl">VERIFY OTP</h1>
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
              backgroundColor: "#FFEA35",
              border: "2px solid black",
            }}
          />
          <button onClick={onOTPVerify} className="bg-black w-full flex mt-10 gap-1 items-center justify-center py-2.5 text-white rounded">
            {loading && <CgSpinner size={20} className="mt-1 animate-spin" />}
            <span>Verify OTP</span>
          </button>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-3 sm:p-6">
          <h2 className="text-center font-semibold text-black text-2xl">Complete Your Profile</h2>
          <label htmlFor="name" className="font-bold text-lg text-black">Name</label>
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
          <label htmlFor="age" className="font-bold text-lg text-black">Age</label>
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
          <label htmlFor="email" className="font-bold text-lg text-black">Email</label>
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
          <label htmlFor="state" className="font-bold text-lg text-black">State</label>
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
          <button type="submit" className="bg-black w-full py-3 text-[#FFEA35] rounded-md mt-4" disabled={loading}>
            {loading ? <CgSpinner size={20} className="animate-spin" /> : "Submit"}
          </button>
        </form>
      )}
    </Dialog>
  );
};

export default AuthModal;
