import styling from "./SecondPartHome.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import CategoryCardImg from "../../components/cards/CategoryCardImg";

export default function SecondPartHome() {
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
  console.log("CATEGORIES", categories);
  return (
    <div className={`container-fluid ${styling.secondPartBody}`}>
      <div className={`${styling.secondPartCategories}`}>
        <h1>Categories</h1>
      </div>
      <div className={`${styling.secondPartImages}`}>
        <div className={`row`}>
          {categories?.map((category) => {
            return <CategoryCardImg key={category._id} category={category} />;
          })}
        </div>
      </div>
    </div>
  );
}
