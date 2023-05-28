import styling from "./MainPartHome.module.css";
import plantMain from "../../images/plant-home.png";

export default function MainPartHome() {
  return (
    <div className={`${styling.mainPartBody}`}>
      <div className={`${styling.mainPartLeft}`}>
        <h2 className={``}>Find perfect plants for your home</h2>
        <p>Beautiful plants that encourage you to get creative.</p>
        <button className={`btn btn-dark`}>Shop now</button>
      </div>
      <div className={`${styling.mainPartRight}`}>
        <img src={plantMain} alt="plant"/>
      </div>
    </div>
  );
}
