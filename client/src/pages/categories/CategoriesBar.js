import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styling from "./CategoriesBar.module.css";

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
                <img src={`${process.env.REACT_APP_API}/category/photo/${category._id}`} alt="category" className={styling.cardImg} />
                {category.name}
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
