import { useAuth } from "../../context/auth";
import { useEffect, useState } from "react";
import axios from "axios";
import UserMenu from "../../components/nav/UserMenu";
import { toast } from "react-hot-toast"; // react-toastify
import { Trans, useTranslation } from "react-i18next";

export default function UserProfile() {
  // context
  const [auth, setAuth] = useAuth();
  // Translate
  const { t } = useTranslation();
  // state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [CAP, setCAP] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    if (auth?.user) {
      console.log("AUTH USER", auth.user);
      const { firstName, lastName, email, address, CAP, city, country } =
        auth.user;
      setFirstName(firstName);
      setLastName(lastName);
      setEmail(email);
      setAddress(address);
      setCAP(CAP);
      setCity(city);
      setCountry(country);
    }
  }, [auth?.user]);
  // hanlde if google login or email
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        auth.user.provider === "google" ||
        auth.user.provider === "facebook" ||
        auth.user.provider === "apple"
      ) {
        const { data } = await axios.put("/profile", {
          firstName,
          lastName,
          address,
          CAP,
          city,
          country,
          provider: auth.user.provider,
        });
        // Handle error
        if (data?.error) {
          toast.error(data.error);
          return;
        } else {
          // Update context
          setAuth({ ...auth, user: data });
          // local storage
          let localData = JSON.parse(localStorage.getItem("auth"));
          // Update only user in local storage
          localData.user = data;
          // Save to local storage
          localStorage.setItem("auth", JSON.stringify(localData));
          // success message
          toast.success("Profile updated");
        }
      } else {
        const { data } = await axios.put("/profile", {
          firstName,
          lastName,
          address,
          CAP,
          city,
          country,
          password,
        });
        if (data?.error) {
          toast.error(data.error);
          return;
        } else {
          // Update context
          setAuth({ ...auth, user: data });
          // local storage
          let localData = JSON.parse(localStorage.getItem("auth"));
          // Update only user in local storage
          localData.user = data;
          // Save to local storage
          localStorage.setItem("auth", JSON.stringify(localData));
          // success message
          toast.success("Profile updated");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {/* <pre>{JSON.stringify(auth, null, 4)}</pre> */}
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>

          <div className="col-md-9">
            <div className="p-3 mt-2 mb-2 h4 bg-light"><Trans>Profile</Trans></div>
            <form className="pb-5" onSubmit={handleSubmit}>
              <label className="form-label mx-3 mb-0">
                <h5>
                  <Trans>First name</Trans>
                </h5>
              </label>
              <input
                type="text"
                className="form-control m-2 p-2"
                placeholder={t('firstNamePlaceholder')}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoFocus={true}
              />
              <label className="form-label mx-3 mb-0">
                <h5>
                  <Trans>Last name</Trans>
                </h5>
              </label>
              <input
                type="text"
                className="form-control m-2 p-2"
                placeholder={t('lastNamePlaceholder')}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <label className="form-label mx-3 mb-0">
                <h5>Email</h5>
              </label>
              <input
                type="email"
                className="form-control m-2 p-2"
                placeholder={t('emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={true}
              />
              {/* Show password only if login with email */}
              {auth.user.provider === "google" ||
              auth.user.provider === "facebook" ||
              auth.user.provider === "apple" ? null : (
                <>
                  <label className="form-label mx-3 mb-0">
                    <h5>Password</h5>
                  </label>
                  <input
                    type="password"
                    className="form-control m-2 p-2"
                    placeholder={t('passwordPlaceholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </>
              )}

              <label className="form-label mx-3 mb-0">
                <h5>
                  <Trans>Address</Trans>
                </h5>
              </label>
              <input
                className="form-control m-2 p-2"
                placeholder={t('addressPlaceholder')}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <label className="form-label mx-3 mb-0">
                <h5>
                  <Trans>CAP</Trans>
                </h5>
              </label>
              <input
                className="form-control m-2 p-2"
                placeholder="CAP"
                value={CAP}
                onChange={(e) => setCAP(e.target.value)}
              />
              <label className="form-label mx-3 mb-0">
                <h5>
                  <Trans>City</Trans>
                </h5>
              </label>
              <input
                className="form-control m-2 p-2"
                placeholder={t('City')}
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <label className="form-label mx-3 mb-0">
                <h5>
                  <Trans>Country</Trans>
                </h5>
              </label>
              <input
                className="form-control m-2 p-2"
                placeholder={t('Country')}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
              <button
                className="btn btn-outline-primary mt-3 m-2 p-2"
                type="submit"
              >
                <Trans>Update</Trans>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
