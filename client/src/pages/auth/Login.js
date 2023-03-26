import "../../styles/login.css";
import googleIcon from "../../images/google.png";
import facebookIcon from "../../images/facebook.png";
import linkedinIcon from "../../images/linkedin.png";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useAuth } from "../../context/auth";

const Login = () => {
  const [auth, setAuth] = useAuth();
  const google = () => {
    window.open("http://localhost:8000/auth/google", "_self");
    // setAuth({ ...auth, isLogout: false });
  };

  const facebook = () => {
    window.open("http://localhost:8000/auth/facebook", "_self");
  };

  const linkedin = () => {
    window.open("http://localhost:8000/auth/linkedin", "_self");
  };

  return (
    <div className="login">
      <h1 className="loginTitle">Choose a login method</h1>
      <div className="wrapper">
        <div className="left">
          <div className="loginButton facebook" onClick={facebook}>
            <img src={facebookIcon} alt="" className="icon" />
            Facebook
          </div>
          <div className="loginButton google" onClick={google}>
            <img src={googleIcon} alt="" className="icon" />
            Google
          </div>
          <div className="loginButton linkedin" onClick={linkedin}>
            <img src={linkedinIcon} alt="" className="icon" />
            Linkedin
          </div>
        </div>
        <div className="center">
          <div className="line" />
          <div className="or">OR</div>
        </div>
        <div className="right">
          <input type="text" placeholder="Username" />
          <input type="text" placeholder="Password" />
          <button className="submit">Login</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
