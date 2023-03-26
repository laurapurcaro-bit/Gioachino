import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Menu from "./components/nav/Menu";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/user/Dashboard";
import { useAuth } from "./context/auth";

const PageNotFound = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      404 - Page not found
    </div>
  );
};

export default function App() {
  const [auth, setAuth] = useAuth();
  useEffect(() => {
    const getUser = () => {
      fetch("http://localhost:8000/auth/login/success", {
        method: "GET",
        // mode: 'no-cors',
        // withCredentials: true,
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000",
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          "Access-Control-Allow-Headers":
            "Origin, X-Requested-With, Content-Type, Accept, X-Auth-Token, Authorization",
        },
      })
        .then((res) => {
          if (res.status === 200) return res.json();
          throw new Error("failed to authenticate user");
        })
        .then((resJson) => {
          localStorage.setItem("auth", JSON.stringify(resJson.user));
          // Put context
          // spread operator: ...auth
          setAuth({
            ...auth,
            user: resJson.user,
            logged: true,
            isLogout: false,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    };
    if (auth.logged === false && auth.isLogout === false) {
      getUser();
    } else {
      console.log("user is logged out");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log("AUTH", auth);
  return (
    <Router>
      <Menu />
      {/* Snack bar */}
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="*" element={<PageNotFound />} replace />
      </Routes>
    </Router>
  );
}
