import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/auth";
import styling from "./UserMenu.module.css";
import { Trans } from "react-i18next";

export default function UserMenu() {
  const [auth] = useAuth();
  return (
    <>
      <div className={styling.dashboardLeft}>
        <ul className="list-group list-unstyled">
          <li>
            <NavLink
              className={styling.dashboardSection}
              to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}
            >
              <Trans>Overview</Trans>
            </NavLink>
          </li>
          <li>
            <NavLink
              className={styling.dashboardSection}
              to="/dashboard/user/profile"
            >
              <Trans>Personal details</Trans>
            </NavLink>
          </li>
          <li>
            <NavLink className={styling.dashboardSection} to="">
              <Trans>Saved items</Trans>
            </NavLink>
          </li>
          <li>
            <NavLink
              className={styling.dashboardSection}
              to="/dashboard/user/orders"
            >
              <Trans>My orders</Trans>
            </NavLink>
          </li>
          <li>
            <NavLink className={styling.dashboardSection} to="">
              <Trans>Returns</Trans>
            </NavLink>
          </li>
          <li>
            <NavLink className={styling.dashboardSection} to="/dashboard/user/addresses">
              <Trans>Addresses</Trans>
            </NavLink>
          </li>
          <li>
            <NavLink className={styling.dashboardSection} to="">
              <Trans>Payment methods</Trans>
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
}
