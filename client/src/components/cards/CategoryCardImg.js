import { Link } from "react-router-dom";

export default function CategoryCardImg({ category }) {
  return (
    <div className="col-md-3">
      <div className="card">
        <div className="text-center">
          <img
            src={`${
              process.env.REACT_APP_S3_HTTP_BUCKET_DEV
            }/categories/${category.slug.toLowerCase()}/${category._id}.png`}
            alt="category"
            className="img img-responsive"
            height="200px"
          />
        </div>
        <div className="card-body text-center">
          <Link
            className="btn btn-light col-4 text-dark p-3"
            to={`/category/${category.slug}`}
          >
            {category.name}
          </Link>
        </div>
      </div>
    </div>
  );
}
