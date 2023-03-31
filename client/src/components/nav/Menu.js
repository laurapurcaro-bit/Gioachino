import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/auth";
import SearchBar from "../forms/SearchBar";
import axios from "axios";
import "../../styles/app.css";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/cart";
import { Badge } from "antd";

export default function Menu() {
  // context
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  // hook
  // const navigate = useNavigate();
  // custom hook
  const categories = useCategory();
  console.log(categories);

  const logout = async () => {
    console.log("removing local storage");
    // set user to null
    setAuth({ ...auth, user: null, token: "", logged: false, isLogout: true });
    // remove token from local storage
    localStorage.removeItem("auth");
    // remove token from axios header
    await axios
      .get("/auth/logout", {
        credentials: "include", // <--- YOU NEED THIS LINE
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:3000",
          "Access-Control-Allow-Credentials": true,
        },
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  return (
    <>
      {/* justify-content-between: add space between elements; shadow: put bar with shadow; mb-2: margin-bottom: 2*/}
      <ul className="nav d-flex justify-content-between shadow-sm mb-2 sticky-top bg-light">
        {/* Homepage */}
        <li className="nav-item">
          <NavLink className="nav-link" aria-current="page" to="/">
            Homepage
          </NavLink>
        </li>
        {/* Shop */}
        <li className="nav-item">
          <NavLink className="nav-link" aria-current="page" to="/shop">
            Shop
          </NavLink>
        </li>
        {/* Category dropdown */}
        <div className="dropdown">
          <li className="nav-item">
            <a
              className="nav-link pointer dropdown-toggle"
              data-bs-toggle="dropdown"
              href="/"
            >
              Categories
            </a>
            <ul
              className="dropdown-menu"
              style={{ height: "220px", overflow: "scroll" }}
            >
              <li>
                <NavLink className="nav-link" to={`/categories`}>
                  All categories
                </NavLink>
              </li>
              {categories?.map((category) => {
                return (
                  <li key={category._id}>
                    <NavLink
                      className="nav-link"
                      to={`/category/${category.slug}`}
                    >
                      {category.name}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </li>
        </div>
        {/* Search bar */}
        <SearchBar />
        {/* Cart */}
        <li className="nav-item">
          <Badge
            className="pt-2"
            count={cart?.length || null}
            offset={[-2, 13]}
          >
            <NavLink className="nav-link" aria-current="page" to="/cart">
              CART
            </NavLink>
          </Badge>
        </li>
        {/* User menu */}
        {/* if condition true => do login register : do logout */}
        {!auth.user ? (
          <>
            <li className="nav-item">
              <NavLink className="nav-link" to="/login">
                Login
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/register">
                Register
              </NavLink>
            </li>
          </>
        ) : (
          <div className="dropdown">
            <li className="nav-item">
              <a
                className="nav-link pointer dropdown-toggle"
                data-bs-toggle="dropdown"
                href="/"
              >
                {auth.user?.firstName.toUpperCase()}
              </a>
              <ul className="dropdown-menu">
                <li>
                  <NavLink
                    className="nav-link"
                    to={`/dashboard/${
                      auth?.user?.role === 1 ? "admin" : "user"
                    }`}
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link pointer" onClick={logout} to="/">
                    Logout
                  </NavLink>
                </li>
              </ul>
            </li>
          </div>
        )}
      </ul>
    </>
  );
}
