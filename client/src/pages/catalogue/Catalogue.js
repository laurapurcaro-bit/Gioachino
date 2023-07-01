import { useState, useEffect } from "react";
import CategoriesBar from "../categories/CategoriesBar";
import axios from "axios";
import ProductCard from "../../components/cards/ProductCard";
import Filters from "./Filters";
import { prices } from "../../constants";
import styling from "./Catalogue.module.css";
import { Trans } from "react-i18next";
import SelectedFilters from "./SelectedFilters";

export default function Catalogue() {
  const [categories, setCateories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState([]); // selected filter

  useEffect(() => {
    // if (!checkedCategories.length || !radioPrice.length) {
    loadProducts();
    // }
    // eslint-disable-next-line
  }, []);

  const loadProducts = async () => {
    try {
      const { data } = await axios.get("/products");
      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadCategories();
    // remove order when in shop
    localStorage.removeItem("order");
  }, []);

  const loadCategories = async () => {
    try {
      const { data } = await axios.get("/categories");
      setCateories(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <CategoriesBar />
      <div className={`container-fluid ${styling.productContainer}`}>
        <div className="row">
          <div className={`col-md-12 ${styling.shopContainer}`}>
            <Filters
              categories={categories}
              prices={prices}
              setSelectedFilter={setSelectedFilter}
              setProducts={setProducts}
            />
            <div className={`${styling.lineContainer}`}>
              <hr className={`${styling.line}`} />
            </div>
            {/* Selected filters */}
            <div className={`${styling.selectedFilterContainer}`}>
              {selectedFilter && (
                <SelectedFilters
                  selectedFilter={selectedFilter}
                  setSelectedFilter={setSelectedFilter}
                />
              )}
            </div>
            {/* <h2 className="p-3 mt-2 mb-2 h4 bg-light text-center">{products?.length} Products</h2> */}
            <div className={"row"}>
              {products?.map((product) => {
                return (
                  <div
                    className={`col-md-4 ${styling.cardContainer}`}
                    key={product._id}
                  >
                    <ProductCard product={product} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
