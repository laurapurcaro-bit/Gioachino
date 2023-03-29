import { useState, useEffect } from "react";
import Jumbotron from "../components/cards/Jumbotron";
import axios from "axios";
import ProductCard from "../components/cards/ProductCard";
import { Checkbox, Radio } from "antd";
import { prices } from "../prices";

export default function Shop() {
  const [categories, setCateories] = useState([]);
  const [products, setProducts] = useState([]);
  const [checkedCategories, setCheckedCategories] = useState([]); // categories
  const [radioPrice, setRadioPrice] = useState([]); // price range

  useEffect(() => {
    if (!checkedCategories.length || !radioPrice.length) {
      loadProducts();
    }
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
  }, []);

  const loadCategories = async () => {
    try {
      const { data } = await axios.get("/categories");
      setCateories(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCategoryFilter = (value, id) => {
    //
    let all = [...checkedCategories];
    if (value) {
      // we need to add the category id to state to make request to backend
      all.push(id);
    } else {
      // we don't want to have duplicates
      // we need to filter out the category id from state to make request to backend
      all = all.filter((c) => c !== id);
    }
    setCheckedCategories(all);
  };

  const handlePriceFilter = (e) => {
    setRadioPrice(e.target.value);
  };

  // Handle filter, whenever filter changes, we want to make a request to backend
  useEffect(() => {
    if (checkedCategories.length || radioPrice.length) {
      fetchProductsByFilter();
    }
    // eslint-disable-next-line
  }, [checkedCategories, radioPrice]);

  const fetchProductsByFilter = async () => {
    try {
      const { data } = await axios.post("/filtered-products", {
        checkedCategories,
        radioPrice,
      });
      console.log(data);
      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Jumbotron title="Gioachino" subtitle="Welcome to the e-commerce" />
      {/* <pre>{JSON.stringify({ checkedCategories, radioPrice }, null, 4)}</pre> */}
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <h2 className="p-3 mt-2 mb-2 h4 bg-light text-center">Filters</h2>
            <h6>Filter by Categories</h6>
            <div className="row p-2 checkbox-custom">
              {categories?.map((category) => {
                return (
                  <Checkbox
                    key={category._id}
                    onChange={(e) => {
                      handleCategoryFilter(e.target.checked, category._id);
                    }}
                  >
                    {category.name}
                  </Checkbox>
                );
              })}
            </div>
            <h6>Filter by Prices</h6>
            <div className="row p-2">
              <Radio.Group onChange={(e) => handlePriceFilter(e)}>
                {prices.map((price) => {
                  return (
                    <div key={price._id}>
                      <Radio value={price.array}>{price.name}</Radio>
                    </div>
                  );
                })}
              </Radio.Group>
            </div>
            {/* Reset filter */}
            <div className="p-3 pt-3">
              <button
                className="btn btn-outline-secondary col-12"
                onClick={() => window.location.reload()}
              >
                Reset filter
              </button>
            </div>
          </div>
          <div className="col-md-9">
            <h2 className="p-3 mt-2 mb-2 h4 bg-light text-center">
              {products?.length} Products
            </h2>
            <div
              className="row"
              //   vh is for lenth of displayed product
              style={{ height: "100vh", overflow: "scroll" }}
            >
              {products?.map((product) => {
                return (
                  <div className="col-md-4" key={product._id}>
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
