// Destructuring the props
// You can give a default value to the props
export default function Jumbotron({
  title,
  subTitle = "Welcome to e-commerce",
}) {
  return (
    <div className="container-fluid ">
      <div className="row">
        {/* p-4: padding 4 */}
        <div className="col text-center p-4 bg-light">
          {/* display-4: changes the text */}
          <h1 className="display-4">{title}</h1>
          <p className="lead">{subTitle}</p>
        </div>
      </div>
    </div>
  );
}
