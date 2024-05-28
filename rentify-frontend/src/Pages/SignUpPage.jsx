import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/SignUpPage.css";

const SignUpPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("buyer");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNo = (phoneNo) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNo);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !phoneNo || !password) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!validatePhoneNo(phoneNo)) {
      setErrorMessage("Please enter a valid 10-digit phone number.");
      return;
    }

    setErrorMessage("");

    try {
      const response = await axios.post(" /api/users", {
        firstName,
        lastName,
        email,
        phone: phoneNo,
        password,
        userType,
      });

      console.log(response.data);
      navigate("/signin");
    } catch (error) {
      console.error("There was an error signing up!", error);
      setErrorMessage(
        error.response?.data?.message || "There was an error signing up."
      );
    }
  };

  return (
    <div className="signUpPage">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <div className="input-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="input-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="input-group">
          <label htmlFor="phoneNo">Phone No:</label>
          <input
            type="tel"
            id="phoneNo"
            name="phoneNo"
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="input-group">
          <label>User Type:</label>
          <div>
            <input
              type="radio"
              id="buyer"
              name="userType"
              value="buyer"
              checked={userType === "buyer"}
              onChange={() => setUserType("buyer")}
              className="radio-field"
            />
            <label htmlFor="buyer">Buyer</label>
          </div>
          <div>
            <input
              type="radio"
              id="seller"
              name="userType"
              value="seller"
              checked={userType === "seller"}
              onChange={() => setUserType("seller")}
              className="radio-field"
            />
            <label htmlFor="seller">Seller</label>
          </div>
        </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <button type="submit" className="submit-button">
          Sign Up
        </button>
      </form>
      <p>
        Already have an account? <Link to="/signin">Sign In</Link>
      </p>
    </div>
  );
};

export default SignUpPage;
