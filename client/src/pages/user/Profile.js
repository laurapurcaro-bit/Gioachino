import { useAuth } from "../../context/auth";
import { useEffect, useState } from "react";
import axios from "axios";
import UserMenu from "../../components/nav/UserMenu";
import { toast } from "react-hot-toast"; // react-toastify
import { Trans, useTranslation } from "react-i18next";
import styling from "./Profile.module.css";

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
  const [street, setStreet] = useState("");
  const [CAP, setCAP] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    if (auth?.user) {
      const { firstName, lastName, email, shippingAddresses } =
        auth.user;
      setFirstName(firstName);
      setLastName(lastName);
      setEmail(email);
      setStreet(shippingAddresses[0]?.street);
      setCAP(shippingAddresses[0]?.CAP);
      setCity(shippingAddresses[0]?.city);
      setCountry(shippingAddresses[0]?.country);
    }
  }, [auth?.user]);
  // hanlde if google login or email
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newAddress = {
      street: street,
      CAP,
      city,
      country,
    };

    const updatedAddresses = [...addresses, newAddress];
    try {
      if (
        auth.user.provider === "google" ||
        auth.user.provider === "facebook" ||
        auth.user.provider === "apple"
      ) {

        const { data } = await axios.put("/profile", {
          firstName,
          lastName,
          addresses: updatedAddresses,
          provider: auth.user.provider,
        });
        // Handle error
        if (data?.error) {
          toast.error(data.error);
          return;
        } else {
          setAddresses(updatedAddresses);
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
          addresses: updatedAddresses,
          password,
        });
        if (data?.error) {
          toast.error(data.error);
          return;
        } else {
          setAddresses(updatedAddresses);
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
      <div className={`container-fluid ${styling.containerMain}`}>
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
                  <Trans>Street</Trans>
                </h5>
              </label>
              <input
                className="form-control m-2 p-2"
                placeholder={t('streetPlaceholder')}
                value={street}
                onChange={(e) => setStreet(e.target.value)}
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
