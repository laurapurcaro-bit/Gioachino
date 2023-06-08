import { useAuth } from "../../context/auth";
import { NavLink } from "react-router-dom";
import styling from "./Dashboard.module.css";
import UserMenu from "../../components/nav/UserMenu";
import { Trans } from "react-i18next";

export default function UserDashboard() {
  // context
  const [auth] = useAuth();
  console.log("USER DASHBOARD", auth);

  return (
    <>
      {/* <pre>{JSON.stringify(auth, null, 4)}</pre> */}
      <div className={`container-fluid ${styling.containerMain}`}>
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className={`${styling.dashboardDiv} col-md-9`}>
            <h2>
              👋 <Trans>Hello</Trans> {auth.user?.firstName.toLowerCase()}{" "}
            </h2>
            <h2><Trans>Your account</Trans></h2>
            <p>
            <Trans>In your account, Gioachino, you can manage your orders, returns, and contact information.</Trans>
            </p>
            <div className={styling.centerDiv}>
              <p><Trans>Here you can find information about your updates, returns, or refunds.</Trans></p>
              <button className={styling.buttonShop}>
                <NavLink className={styling.buttonShopText} to="/">
                  <Trans>Continue shopping.</Trans>
                </NavLink>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
