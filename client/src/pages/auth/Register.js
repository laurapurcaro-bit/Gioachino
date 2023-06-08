import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import styling from "./Register.module.css";
import googleIcon from "../../images/google.svg";
import facebookIcon from "../../images/facebook.svg";
import appleIcon from "../../images/apple.svg";

export default function RegisterPopup({
  showRegisterPopup,
  setShowRegisterPopup,
  setShowLoginPopup
}) {
  // state
  const [firstName, setFirstName] = useState("La");
  const [lastName, setLastName] = useState("Mimi");
  const [email, setEmail] = useState("lau@gmail.com");
  const [password, setPassword] = useState("1234567890");
  const [confirmPassword, setConfirmPassword] = useState("1234567890");

  // hook
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Translate
  const { t } = useTranslation();

  const handleClose = () => {
    handleClosing();
  };

  const handleClosing = () => {
    setShowRegisterPopup(false);
  };

  const handleSubmit = async (e) => {
    // Prevent the default behavior of the browser to reload the page
    e.preventDefault();

    try {
      //
      const { data } = await axios.post("/register", {
        firstName,
        lastName,
        email,
        password,
      });
      if (data?.error) {
        toast.error(data.error);
      } else {
        // Save user and token to local storage
        localStorage.setItem("auth", JSON.stringify(data));
        setAuth({ ...auth, user: data.user, token: data.token });
        setShowRegisterPopup(false);
        toast.success("Successfull registration. Please register.");
        navigate(
          location.state ||
            `/dashboard/${data?.user?.role === 1 ? "admin" : "user"}`
        );
      }
    } catch (error) {
      toast.error("Register failed. Please try again.");
      setShowRegisterPopup(false);
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
      {showRegisterPopup && (
        <>
          <div className={`${styling.overlay}`} />
          <div className={`${styling.registerPopup}`}>
            <div className={`${styling.registerPopupContent} ${styling.shrinkContent}`}>
              <span className={`${styling.registerClose}`} onClick={handleClose}>
                &times;
              </span>
              <div className={styling.wrapper}>
                <p>
                  ✨ <Trans>Register Here</Trans> ✨
                </p>
                <div className={styling.up}>
                  <form onSubmit={handleSubmit}>
                    <p className={styling.inputTitle}>
                      <Trans>First name</Trans>
                    </p>
                    <input
                      type="text"
                      placeholder={t('firstNamePlaceholder')}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    <p className={styling.inputTitle}>
                      <Trans>Last name</Trans>
                    </p>
                    <input
                      type="text"
                      placeholder={t('lastNamePlaceholder')}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                    <p className={styling.inputTitle}>Email</p>
                    <input
                      type="email"
                      placeholder={t('emailPlaceholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <p className={styling.inputTitle}>Password</p>
                    <input
                      type="password"
                      placeholder={t('passwordPlaceholder')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <p className={styling.inputTitle}>
                      <Trans>Confirm password</Trans>
                    </p>
                    <input
                      type="password"
                      placeholder={t('confirmPasswordPlaceholder')}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button className={styling.submit} type="submit">
                      <Trans>REGISTER</Trans>
                    </button>
                  </form>
                </div>
                <p className={styling.or}>
                  <Trans>or register with</Trans>
                </p>
                <div className={styling.down}>
                  <div className={`${styling.registerButton}`} onClick={google}>
                    <img src={googleIcon} alt="" className={styling.icon} />
                  </div>
                  <div className={`${styling.registerButton}`} onClick={facebook}>
                    <img src={facebookIcon} alt="" className={styling.icon} />
                  </div>
                  <div className={`${styling.registerButton}`} onClick={linkedin}>
                    <img src={appleIcon} alt="" className={styling.icon} />
                  </div>
                </div>
              </div>
              <span
                className={`${styling.alreadyRegister}`}
                onClick={(e) => {
                    setShowLoginPopup(true);
                    setShowRegisterPopup(false);
                  }}
              >
                <Trans>Already registered? Login here.</Trans>
              </span>
            </div>
          </div>
        </>
      )}
    </>
  );
}
