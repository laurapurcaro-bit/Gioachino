import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/auth";
import { Toaster } from "react-hot-toast";
// Import scripts
import Menu from "./components/nav/Menu";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/user/Dashboard";
import Register from "./pages/auth/Register";
import GetUser from "./pages/auth/GetUser";
import AdminDashboard from "./pages/admin/Dashboard";
import PrivateRoute from "./components/routes/PrivateRoute";
import AdminRoute from "./components/routes/AdminRoute";
import AdminCategory from "./pages/admin/Category";
import AdminCreateProduct from "./pages/admin/ProductCreate";
import AdminShowProducts from "./pages/admin/ProductShow";
import AdminUpdateProduct from "./pages/admin/ProductUpdateAndDelete";
import UserOrders from "./pages/user/Orders";
import UserProfile from "./pages/user/Profile";
import Shop from "./pages/Shop";

const PageNotFound = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      404 - Page not found
    </div>
  );
};

export default function App() {
  const [auth, setAuth] = useAuth();
  // Get user only once
  useEffect(() => {
    try {
      GetUser({ auth, setAuth });
    } catch (error) {
      console.log(error);
    }
    // Put context
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
        <Route path="/shop" element={<Shop />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Insert routes you want to protect */}
        <Route path="/dashboard" element={<PrivateRoute />}>
          {/* No need of / before "secret" because of path="" before */}
          <Route path="user" element={<Dashboard />} />
          <Route path="user/profile" element={<UserProfile />} />
          <Route path="user/orders" element={<UserOrders />} />
        </Route>
        <Route path="/dashboard" element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/category" element={<AdminCategory />} />
          <Route path="admin/product" element={<AdminCreateProduct />} />
          <Route path="admin/products" element={<AdminShowProducts />} />
          <Route
            path="admin/products/update/:slug"
            element={<AdminUpdateProduct />}
          />
        </Route>
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="*" element={<PageNotFound />} replace />
      </Routes>
    </Router>
  );
}
