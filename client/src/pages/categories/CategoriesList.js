import useCategory from "../../hooks/useCategory";
import { Link } from "react-router-dom";
import { Trans } from "react-i18next";

export default function CategoriesList() {
  const categories = useCategory();

  return (
    <>
      <div className="container overflow-hidden">
        <div className="row gx-5 gy-5 mt-3 mb-5">
          {categories?.map((category) => {
            return (
              <div className="col-md-6" key={category._id}>
                <div className="card">
                  <div className="card-body text-center">
                    <Link className="btn btn-light col-12 text-dark p-3" to={`/category/${category.slug}`}>
                      <Trans>{category.name}</Trans>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
