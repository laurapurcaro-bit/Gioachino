import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
// Context
import { useAuth } from "./context/auth";
// styles
import styling from "./App.module.css";
// Translate
import { useTranslation, Trans } from "react-i18next";

// Import pages
import Navbar from "./components/nav/Navbar";
import Home from "./pages/homepage/Home";
import LoginPopup from "./pages/auth/Login";
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
import ResultsSearchBar from "./pages/ResultsSearchBar";
import CategoriesList from "./pages/categories/CategoriesList";
import CategoryView from "./pages/categories/CategoryView";
import Cart from "./pages/cart/Cart";
import ManageOrdersAdmin from "./pages/admin/ManageOrders";
import AdminResultsSearchBar from "./pages/admin/AdminResultsSearchBar";
import Popup from "./components/popup/Popup";
import Footer from "./components/footer/Footer";
import SingleProductPage from "./pages/product/SingleProductPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import OrderConfirmationPage from "./pages/checkout/OrderConfirmation";

const PageNotFound = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      404 - Page not found
    </div>
  );
};

export default function App() {
  const [auth, setAuth] = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  // Translate
  const { t, i18n } = useTranslation();

  const changeLanguage = lng => {
    console.log("lng", lng);
    i18n.changeLanguage(lng);
  };
  // Get user only once
  useEffect(() => {
    try {
      if (auth.logged === false) {
        GetUser({ auth, setAuth });
        return;
      }
    } catch (error) {
      console.log(error);
    }
    // Put context
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log("AUTH", auth);

  useEffect(() => {
    const hasShownPopup = localStorage.getItem("hasShownPopup");
    if (!hasShownPopup) {
      const timer = setTimeout(() => {
        setShowPopup(true);
        localStorage.setItem("hasShownPopup", true);
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setShowPopup(false);
    }
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <Router>
      {/* Navbar */}
      <Navbar setShowLoginPopup={setShowLoginPopup} />
      {/* Snack bar */}
      <Toaster position="top-center" />
      {/* Signin to newsletter popup */}
      {showPopup && (
        <>
          <div className={styling.overlay} />
          <Popup onClose={handleClosePopup} />
        </>
      )}
      {/* Login popup */}
      {showLoginPopup && (
        <>
          <LoginPopup
            showLoginPopup={showLoginPopup}
            setShowLoginPopup={setShowLoginPopup}
          />
        </>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/categories" element={<CategoriesList />} />
        <Route path="/category/:slug" element={<CategoryView />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/search" element={<ResultsSearchBar />} />
        {/* Dynamic creation of route */}
        <Route path="/product/:slug" element={<SingleProductPage />} />
        {/* <Route path="/login" element={<LoginPopup />} /> */}
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
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
          <Route path="admin/orders" element={<ManageOrdersAdmin />} />
          <Route path="admin/search" element={<AdminResultsSearchBar />} />
          <Route
            path="admin/products/update/:slug"
            element={<AdminUpdateProduct />}
          />
        </Route>
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="*" element={<PageNotFound />} replace />
      </Routes>
      {/* Footer */}
      <Footer changeLanguage={changeLanguage} />
    </Router>
  );
}
