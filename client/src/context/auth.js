import { useState, createContext, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
    logged: false,
    isLogout: false,
  });

  // axios config for all requests
  if (window.location.hostname === 'localhost') {
    // Local environment
    axios.defaults.baseURL = process.env.REACT_APP_API;
  } else {
    // App Engine environment or other deployment
    axios.defaults.baseURL = process.env.REACT_APP_URL;
  }
  axios.defaults.headers.common["Authorization"] = auth?.token;

  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const parsed = JSON.parse(data);
      setAuth({
        ...auth,
        user: parsed.user,
        token: parsed.token,
        logged: false,
        isLogout: false,
      });
    }
    // eslint-disable-next-line
  }, []);
  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

// So now we can use this hook in any component:
// const [auth, setAuth] = useAuth();

export { useAuth, AuthProvider };
