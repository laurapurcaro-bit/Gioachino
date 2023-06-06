import styling from "./SecondPartHome.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import CategoryCardImg from "../../components/cards/CategoryCardImg";
import { Trans } from "react-i18next";

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

  return (
    <div className={`container-fluid ${styling.secondPartBody}`}>
      <div className={`${styling.secondPartCategories}`}>
        <h1><Trans>Categories</Trans></h1>
      </div>
      <div className={`${styling.secondPartImages}`}>
        <div className={styling.row}>
          {categories?.map((category) => {
            return <CategoryCardImg key={category._id} category={category} />;
          })}
        </div>
      </div>
    </div>
  );
}
