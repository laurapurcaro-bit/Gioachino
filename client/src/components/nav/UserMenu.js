import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/auth";
import styling from "./UserMenu.module.css";

export default function UserMenu() {
  const [auth] = useAuth();
  return (
    <>
      <div className={styling.dashboardLeft}>
        <ul className="list-group list-unstyled">
          <li>
            <NavLink className={styling.dashboardSection} to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}>
              Panoramica
            </NavLink>
          </li>
          <li>
            <NavLink className={styling.dashboardSection} to="/dashboard/user/profile">
              Profilo
            </NavLink>
          </li>
          <li>
            <NavLink className={styling.dashboardSection} to="">
              Liste salvati
            </NavLink>
          </li>
          <li>
            <NavLink className={styling.dashboardSection} to="/dashboard/user/orders">
              I miei ordini
            </NavLink>
          </li>
          <li>
            <NavLink className={styling.dashboardSection} to="">
              Resi
            </NavLink>
          </li>
          <li>
            <NavLink className={styling.dashboardSection} to="">
              Indirizzi
            </NavLink>
          </li>
          <li>
            <NavLink className={styling.dashboardSection} to="">
              Pagamento
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
}
