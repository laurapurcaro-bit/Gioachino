import { useAuth } from "../../context/auth";
import { useEffect, useState } from "react";
import axios from "axios";
import Jumbotron from "../../components/cards/Jumbotron";
import UserMenu from "../../components/nav/UserMenu";

export default function UserProfile() {
  // context
  const [auth] = useAuth();
  // state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (auth?.user) {
      const { firstName, lastName, email, address } = auth.user;
      setFirstName(firstName);
      setLastName(lastName);
      setEmail(email);
      setAddress(address);
    }
  }, [auth?.user]);
  // hanlde if google login or email
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put("/profile", {
        firstName,
        lastName,
        address,
        provider: auth.user.provider,
      });
      console.log("PROFILE UPDATE", data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Jumbotron
        title={`Hello ${
          auth?.user?.firstName !== undefined ? auth.user.firstName : ""
        }`}
        subTitle="Dashboard"
      />
      {/* <pre>{JSON.stringify(auth, null, 4)}</pre> */}
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>

          <div className="col-md-9">
            <div className="p-3 mt-2 mb-2 h4 bg-light">Profile</div>
            <form className="pb-5" onSubmit={handleSubmit}>
              <label className="form-label mx-3 mb-0">
                <h5>First name</h5>
              </label>
              <input
                type="text"
                className="form-control m-2 p-2"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => firstName(e.target.value)}
                autoFocus={true}
              />
              <label className="form-label mx-3 mb-0">
                <h5>Last name</h5>
              </label>
              <input
                type="text"
                className="form-control m-2 p-2"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <label className="form-label mx-3 mb-0">
                <h5>Email</h5>
              </label>
              <input
                type="email"
                className="form-control m-2 p-2"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={true}
              />
              <label className="form-label mx-3 mb-0">
                <h5>Password</h5>
              </label>
              <input
                type="password"
                className="form-control m-2 p-2"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label className="form-label mx-3 mb-0">
                <h5>Address</h5>
              </label>
              <textarea
                className="form-control m-2 p-2"
                rows="5"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <button
                className="btn btn-outline-primary mt-3 m-2 p-2"
                type="submit"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
