import "../../styles/login.css";
import googleIcon from "../../images/google.png";
import facebookIcon from "../../images/facebook.png";
import linkedinIcon from "../../images/linkedin.png";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { useAuth } from "../../context/auth";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const [auth, setAuth] = useAuth();
  // state
  const [email, setEmail] = useState("lau@gmail.com");
  const [password, setPassword] = useState("1234567890");

  const navigate = useNavigate();
  const location = useLocation();

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
        // Save user and token to local storage
        localStorage.setItem("auth", JSON.stringify(data));
        // Put context
        // spread operator: ...auth
        setAuth({ ...auth, user: data.user, token: data.token });
        toast.success("Login successful.");
        navigate(
          location.state ||
            `/dashboard/${data?.user?.role === 1 ? "admin" : "user"}`
        );
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
          <form onSubmit={handleEmailSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
