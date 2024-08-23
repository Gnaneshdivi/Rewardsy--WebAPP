// import React, { useState } from "react";

// const Signup = ({ onSignupSubmit, phoneNumber }) => {
//   const [username, setUsername] = useState("");

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     // Submit the signup data, including the phone number
//     onSignupSubmit({ username, phoneNumber });
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <label htmlFor="username">Username:</label>
//       <input
//         type="text"
//         id="username"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//         required
//       />
//       {/* Display the phone number that will be associated with this account */}
//       <div>
//         <label>Phone Number:</label>
//         <span>{phoneNumber}</span>
//       </div>
//       <button type="submit">Complete Signup</button>
//     </form>
//   );
// };

// export default Signup;

import React, { useState } from "react";
import "./Signup.css"; // Ensure styles are set up for Signup

const Signup = ({ onNumberSubmit }) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (onNumberSubmit) {
      onNumberSubmit(phoneNumber);
    }
  };

  return (
    <div className="phone-auth-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="phone-number">Phone Number:</label>
        <input
          type="number"
          id="phone-number"
          name="phone-number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <button type="submit" className="submit-button">
          Send OTP
        </button>
      </form>
    </div>
  );
};

export default Signup;
