import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Navbar from "./Components/Navbar";
import SignInPage from "./Pages/SignInPage";
import SignUpPage from "./Pages/SignUpPage";
import { AuthContext } from "./Context/AuthContext";
import "./App.css";
import "./Styles/Navbar.css";
import AddProperty from "./Pages/AddProperty";
import SellerProperty from "./Pages/SellerProperty";
import Properties from "./Pages/Properties";

function App() {
  const { isLoggedIn, user } = useContext(AuthContext);

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn && user?.userType === "seller" ? (
                <header className="App-header">
                  <h1>Sell Your Perfect Space with Rentify</h1>
                  <Link to="/SellerProperty">
                    <button>Get Started</button>
                  </Link>
                </header>
              ) : (
                <header className="App-header">
                  <h1>Find Your Perfect Space with Rentify</h1>
                  <Link to="/Properties">
                    <button>Get Started</button>
                  </Link>
                </header>
              )
            }
          />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/AddProperty" element={<AddProperty />} />
          <Route path="/SellerProperty" element={<SellerProperty />} />
          <Route path="/Properties" element={<Properties />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
