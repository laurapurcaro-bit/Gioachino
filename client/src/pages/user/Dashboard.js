import { useAuth } from "../../context/auth";
import { NavLink } from "react-router-dom";
import styling from "./Dashboard.module.css";
import UserMenu from "../../components/nav/UserMenu";

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
            <h2>👋 Ciao {auth.user?.firstName.toUpperCase()} </h2>
            <h2>Il tuo account</h2>
            <p>Dal tuo account Gioachino puoi gestire i tuoi ordini, resi e dati di contatto.</p>
            <div className={styling.centerDiv}>
              <p>Trovi qui le info sui tuoi aggiornamenti, resi o rimborsi.</p>
              <button className={styling.buttonShop}>
                <NavLink className={styling.buttonShopText} to="/">
                  Continua lo shopping
                </NavLink>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
