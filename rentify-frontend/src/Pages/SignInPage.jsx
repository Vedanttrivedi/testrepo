import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";
import "../Styles/SignInPage.css";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setUser, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        " /api/users/login",
        {
          email,
          password,
        }
      );

      const { token, user } = response.data;

      // Store JWT token in local storage
      localStorage.setItem("accessToken", token);

      // Optionally, store user data in local storage
      localStorage.setItem("userData", JSON.stringify(user));

      // Update authentication state
      setUser(user);
      setIsLoggedIn(true);

      // Navigate to another route and back to force re-render
      navigate("/");
      navigate(0); // This will reload the page
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "There was an error signing in."
      );
    }
  };

  return (
    <div className="signInPage">
      <h1>Sign In</h1>
      <form onSubmit={handleSignIn}>
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <button type="submit">Sign In</button>
      </form>
      <p>
        New user? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default SignInPage;
