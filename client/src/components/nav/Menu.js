import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/auth";
import "../../styles/app.css";

export default function Menu() {
  // hook
  const [auth, setAuth] = useAuth();

  const logout = () => {
    localStorage.removeItem("auth");
    // set user to null
    setAuth({ ...auth, user: null, logged: false, isLogout: true });
  };

  return (
    <div className="navbar">
      {/* justify-content-between: add space between elements; shadow: put bar with shadow; mb-2: margin-bottom: 2*/}
      <ul className="nav d-flex justify-content-between shadow-sm mb-2">
        <li className="nav-item">
          <NavLink className="nav-link" aria-current="page" to="/">
            Homepage
          </NavLink>
        </li>
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
                {auth.user?.firstName}
              </a>
              <ul className="dropdown-menu">
                <li>
                  <NavLink className="nav-link" to={`/dashboard`}>
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
    </div>
  );
}
