import "../../styles/jumbotron.css";
// Destructuring the props
// You can give a default value to the props
export default function Jumbotron({
  title,
  subTitle = "Welcome to e-commerce",
}) {
  return (
    <div className="container-fluid jumbotron">
      <div className="row">
        {/* p-4: padding 4 */}
        <div className="col text-center p-4">
          {/* display-4: changes the text */}
          <h1 className="display-4 fw-bold">{title}</h1>
          <p className="lead">{subTitle}</p>
        </div>
      </div>
    </div>
  );
}
