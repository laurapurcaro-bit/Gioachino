import styling from "./Login.module.css";
import googleIcon from "../../images/google.svg";
import facebookIcon from "../../images/facebook.svg";
import appleIcon from "../../images/apple.svg";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { useAuth } from "../../context/auth";
import { useNavigate, useLocation } from "react-router-dom";

const LoginPopup = ({ showLoginPopup, setShowLoginPopup }) => {
  const [auth, setAuth] = useAuth();
  // state
  const [email, setEmail] = useState("lau@gmail.com");
  const [password, setPassword] = useState("1234567890");

  const navigate = useNavigate();
  const location = useLocation();
  console.log("Location", location);

  const handleClose = () => {
    handleClosing();
  };

  const handleClosing = () => {
    setShowLoginPopup(false);
  };

  const handleEmailSubmit = async (e) => {
    // Prevent the default behavior of the browser to reload the page
    e.preventDefault();

    try {
      //
      const { data } = await axios.post("/login", {
        email,
        password,
      });
      if (data?.error) {
        toast.error(data.error);
      } else {
        // Close popup
        setShowLoginPopup(false);
        // Save user and token to local storage
        localStorage.setItem("auth", JSON.stringify(data));
        // Put context
        // spread operator: ...auth
        setAuth({ ...auth, user: data.user, token: data.token });
        toast.success("Login successful.");
        navigate(location.state || `/dashboard/${data?.user?.role === 1 ? "admin" : "user"}`);
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };
  // OAuth
  const google = () => {
    window.open("http://localhost:8000/api/auth/google", "_self");
  };

  const facebook = () => {
    window.open("http://localhost:8000/api/auth/facebook", "_self");
  };

  const linkedin = () => {
    window.open("http://localhost:8000/api/auth/linkedin", "_self");
  };

  return (
    <>
      {showLoginPopup && (
        <>
          <div className={`${styling.overlay}`} />
          <div className={`${styling.loginPopup}`}>
            <div className={`${styling.loginPopupContent}`}>
              <span className={`${styling.loginClose}`} onClick={handleClose}>
                &times;
              </span>
              <div className={styling.wrapper}>
                <p>✨ Welcome Back ✨</p>
                <div className={styling.up}>
                  <form onSubmit={handleEmailSubmit}>
                    <p className={styling.inputTitle}>Email</p>
                    <input type="email" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <p className={styling.inputTitle}> Password</p>
                    <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button className={styling.submit} type="submit">
                      LOG IN
                    </button>
                  </form>
                </div>
                <p className={styling.or}>o login con</p>
                <div className={styling.down}>
                  <div className={`${styling.loginButton}`} onClick={google}>
                    <img src={googleIcon} alt="" className={styling.icon} />
                  </div>
                  <div className={`${styling.loginButton}`} onClick={facebook}>
                    <img src={facebookIcon} alt="" className={styling.icon} />
                  </div>
                  <div className={`${styling.loginButton}`} onClick={linkedin}>
                    <img src={appleIcon} alt="" className={styling.icon} />
                  </div>
                </div>
              </div>
              <span className={`${styling.register}`} onClick={handleClose}>
                Not registered? Register here.
              </span>
              <span className={`${styling.recoverPassword}`} onClick={handleClose}>
                Forgot your password?
              </span>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default LoginPopup;
