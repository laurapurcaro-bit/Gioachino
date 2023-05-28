import useCategory from "../../hooks/useCategory";
import Jumbotron from "../../components/cards/Jumbotron";
import { Link } from "react-router-dom";
import styling from "./CategoriesBar.module.css";

export default function CategoriesBar() {
  const categories = useCategory();

  return (
    <>
      {/* <Jumbotron title="Categories" subTitle="List of all categories" /> */}
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
