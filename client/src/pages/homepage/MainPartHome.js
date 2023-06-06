import styling from "./MainPartHome.module.css";
import dogMain from "../../images/persons-dog.jpeg";
import { Trans } from "react-i18next";

export default function MainPartHome() {
  return (
    <div className={`${styling.mainPartBody}`}>
      <div className={`${styling.mainPartLeft}`}>
        <h2 className={``}>
          <Trans>Bring fashion to your furry friend!</Trans>
        </h2>
        <p>
        <Trans>Beautiful dog accessories that encourage you to live with fashion.</Trans>
        </p>
        <button className={`btn btn-dark`}><Trans>Shop now</Trans></button>
      </div>
      <div className={`${styling.mainPartRight}`}>
        <img src={dogMain} className={`${styling.mainImage}`} alt="plant" />
      </div>
    </div>
  );
}
