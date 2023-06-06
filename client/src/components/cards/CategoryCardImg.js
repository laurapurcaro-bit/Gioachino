import { Link } from "react-router-dom";
import styling from "./CategoryCardImg.module.css";
import { Trans } from "react-i18next";

export default function CategoryCardImg({ category }) {
  return (
    <div className={`col-md-3 ${styling.card}`}>
      <div>
        <div className={styling.textCenter}>
          <img
            src={`${process.env.REACT_APP_S3_HTTP_BUCKET_DEV}/categories/${category.slug.toLowerCase()}/${category._id}.png`}
            alt="category"
            className="img img-responsive"
            height="200px"
          />
        </div>
        <div className="card-body text-center">
          <Link className={`btn ${styling.name}`} to={`/category/${category.slug}`}>
            <Trans>{category.name}</Trans>
          </Link>
        </div>
      </div>
    </div>
  );
}
