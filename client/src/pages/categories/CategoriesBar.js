import useCategory from "../../hooks/useCategory";
import { Link } from "react-router-dom";
import styling from "./CategoriesBar.module.css";

export default function CategoriesBar() {
  const categories = useCategory();

  return (
    <>
      <div className={styling.gridContainer}>
        {categories?.map((category) => {
          return (
            <div key={category._id} className={styling.btnContainer}>
              <Link className={`btn ${styling.btn}`} to={`/category/${category.slug}`}>
                {category.name}
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
