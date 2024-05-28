import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import "../Styles/Navbar.css";

const Navbar = () => {
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">Rentify</div>
      <ul className="navbar-links-center">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          {isLoggedIn && user?.userType === "seller" ? (
            <>
              <Link to="/SellerProperty">Properties</Link>
            </>
          ) : (
            <Link to="/Properties">Services</Link>
          )}
        </li>
        <li>
          <Link to="#">About</Link>
        </li>
        <li>
          <Link to="#">Contact</Link>
        </li>
      </ul>
      <div className="navbar-auth">
        {isLoggedIn ? (
          <>
            <span>{user?.firstName}</span>
            <button onClick={handleLogout}>Sign Out</button>
          </>
        ) : (
          <Link to="/signin">Sign In</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
