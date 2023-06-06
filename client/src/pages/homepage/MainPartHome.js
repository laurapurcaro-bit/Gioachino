import styling from "./MainPartHome.module.css";
import dogMain from "../../images/persons-dog.jpeg";

export default function MainPartHome() {
  return (
    <div className={`${styling.mainPartBody}`}>
      <div className={`${styling.mainPartLeft}`}>
        <h2 className={``}>Bring fashion to your furry friend!</h2>
        <p>Beautiful dog accessories that encourage you to live with fashion.</p>
        <button className={`btn btn-dark`}>Shop now</button>
      </div>
      <div className={`${styling.mainPartRight}`}>
        <img src={dogMain} className={`${styling.image}`} alt="plant" />
      </div>
    </div>
  );
}
