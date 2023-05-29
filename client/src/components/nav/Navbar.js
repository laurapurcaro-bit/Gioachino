import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/auth";
import SearchBar from "../forms/SearchBar";
import axios from "axios";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/cart";
import styling from "./Navbar.module.css";

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
    <div className={`${styling.navbar} nav d-flex mb-2 sticky-top`}>
      {/* justify-content-between: add space between elements; shadow: put bar with shadow; mb-2: margin-bottom: 2*/}
      {/* Homepage */}
      <div>
        <h2 className={`${styling.navbarFontLogo}`}>Gioachino</h2>
      </div>
      {/* Center elemnts */}
      <div className={`${styling.centerElements}`}>
        <NavLink className={`${styling.navElements} ${styling.navbarFontLinks}`} aria-current="page" to="/">
          Home
        </NavLink>
        {/* Shop */}
        <NavLink className={`${styling.navElements} ${styling.navbarFontLinks}`} aria-current="page" to="/shop">
          Catalogue
        </NavLink>
        {/* Search bar */}
        <SearchBar />
      </div>
      <div className={styling.rightElements}>
        {/* User menu */}
        {/* if condition true => do login register : do logout */}
        {!auth.user ? (
          <>
            <NavLink className={`${styling.navElements} ${styling.navbarFontLinks}`} to="/login">
              Login
            </NavLink>

            {/* 
              <NavLink className="" to="/register">
                Register
              </NavLink>
             */}
          </>
        ) : (
          <div className="dropdown">
            <a className={`${styling.navElements} ${styling.navbarFontLinks} pointer dropdown-toggle`} data-bs-toggle="dropdown" href="/">
              {auth.user?.firstName.toUpperCase()}
            </a>
            <ul className="dropdown-menu">
              <li>
                <NavLink className={`${styling.navbarFontLinks}`} to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}>
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink className={`${styling.navbarFontLinks} pointer`} onClick={logout} to="/">
                  Logout
                </NavLink>
              </li>
            </ul>
          </div>
        )}
        {/* Wishlist */}

        <NavLink className={`${styling.navElements} ${styling.navbarFontLinks}`} to="/saved-items">
          Likes
        </NavLink>
        {/* Cart */}
        <NavLink className={`${styling.navElements} ${styling.navbarFontLinks}`} aria-current="page" to="/cart">
          {`Cart (${cart?.length || 0})`}
        </NavLink>
      </div>
    </div>
  );
}

{/* Category dropdown */}
{/* <div className="dropdown">
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
</div> */}