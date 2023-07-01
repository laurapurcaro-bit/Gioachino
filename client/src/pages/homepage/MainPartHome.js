import styling from "./MainPartHome.module.css";
import dogMain from "../../images/persons-dog.jpeg";
import { Trans } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function MainPartHome() {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate("/catalogue");
  };
  return (
      <div className={`row ${styling.mainPartBody}`}>
        <div className="col-md-6">
          <div className={`${styling.mainPartLeft}`}>
            <h2 className={``}>
              <Trans>Bring fashion to your furry friend!</Trans>
            </h2>
            <p>
              <Trans>
                Beautiful dog accessories that encourage you to live with
                fashion.
              </Trans>
            </p>
            <button className={`${styling.shopNowBtn}`} onClick={handleShopNow}>
              <Trans>Shop now</Trans>
            </button>
          </div>
        </div>
        <div className="col-md-6">
          <div className={`${styling.mainPartRight}`}>
            <img src={dogMain} className={`${styling.mainImage}`} alt="plant" />
          </div>
        </div>
      </div>
  );
}
