import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styling from "./CategoriesBar.module.css";
import { Trans } from "react-i18next";

export default function CategoriesBar() {
  // const categories = useCategory();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategory();
  }, []);

  const loadCategory = async () => {
    try {
      const { data } = await axios.get("/categories");
      setCategories(data);
      console.log("CATEGORIES",categories);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className={styling.gridContainer}>
        {categories?.map((category) => {
          return (
            <div key={category._id} className={styling.btnContainer}>
              <Link className={`btn ${styling.btn}`} to={`/category/${category.slug}`}>
                <img src={`${process.env.REACT_APP_S3_HTTP_BUCKET_DEV}/categories/${category.slug}/${category._id}.png`} alt="category" className={styling.cardImg} />
                <Trans>{category.name}</Trans>
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
