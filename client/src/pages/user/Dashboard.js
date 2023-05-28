import { useAuth } from "../../context/auth";
import UserMenu from "../../components/nav/UserMenu";

export default function UserDashboard() {
  // context
  const [auth] = useAuth();
  console.log("USER DASHBOARD", auth);

  return (
    <>
      {/* <pre>{JSON.stringify(auth, null, 4)}</pre> */}
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>

          <div className="col-md-9">
            <div className="p-3 mt-2 mb-2 h4 bg-light">User Info</div>
            <ul className="list-group">
              <li className="list-group-item">{auth.user?.firstName}</li>
              <li className="list-group-item">{auth.user?.email}</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
