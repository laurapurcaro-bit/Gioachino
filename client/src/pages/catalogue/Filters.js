import { Trans } from "react-i18next";
import { useState, useEffect } from "react";
import { Checkbox, Radio } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import styling from "./Filters.module.css";
import axios from "axios";

export default function Filters({
  categories,
  prices,
  setSelectedFilter,
  setProducts,
}) {
  // state
  const [showCategories, setShowCategories] = useState(false);
  const [showPrices, setShowPrices] = useState(false);
  const [checkedCategories, setCheckedCategories] = useState([]);
  const [radioPrice, setRadioPrice] = useState("");
  const [selectedCategoryFilters, setSelectedCategoryFilters] = useState([]);
  const [selectedPriceFilter, setSelectedPriceFilter] = useState("");

  const handleShowCategories = () => {
    setShowCategories(!showCategories);
    setShowPrices(false);
  };

  const handleShowPrices = () => {
    setShowPrices(!showPrices);
    setShowCategories(false);
  };

  const handleCategoryFilterSelection = (categoryId) => {
    setSelectedCategoryFilters((prevFilters) => {
      if (prevFilters.includes(categoryId)) {
        return prevFilters.filter((filter) => filter !== categoryId);
      } else {
        return [...prevFilters, categoryId];
      }
    });
  };

  const handlePriceFilterSelection = (priceId) => {
    setSelectedPriceFilter(priceId);
  };

  const handleCategoryFilter = (value, id) => {
    let all = [...checkedCategories];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setCheckedCategories(all);
  };

  const handlePriceFilter = (e) => {
    setRadioPrice(e.target.value);
  };

  useEffect(() => {
    if (checkedCategories.length || radioPrice) {
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

  useEffect(() => {
    const selectedFilters = [];
    console.log("cat", selectedPriceFilter);
    // Add selected category filters
    selectedFilters.push(
      ...selectedCategoryFilters.map((categoryId) => `${categoryId}`)
    );

    // Add selected price filter
    if (selectedPriceFilter) {
      selectedFilters.push(
        `${selectedPriceFilter[0]}€ - ${selectedPriceFilter[1]}€`
      );
    }

    setSelectedFilter(selectedFilters);

    // eslint-disable-next-line
  }, [selectedCategoryFilters, selectedPriceFilter]);

  return (
    <div className={styling.filtersContainer}>
      <div
        className={`${styling.colElements} ${
          showCategories ? styling.active : ""
        }`}
        onClick={handleShowCategories}
      >
        <h4>
          <Trans>Categories</Trans>
        </h4>
        <h4>{showCategories ? <UpOutlined /> : <DownOutlined />}</h4>
        {showCategories && (
          <div className={styling.dropdown}>
            {categories?.map((category) => (
              <Checkbox
                key={category._id}
                value={category._id}
                checked={selectedCategoryFilters.includes(category.name)}
                onChange={(e) => {
                  handleCategoryFilterSelection(category.name);
                  handleCategoryFilter(e.target.checked, category._id);
                }}
              >
                <Trans>{category.name}</Trans>
              </Checkbox>
            ))}
          </div>
        )}
      </div>

      <div
        className={`${styling.colElements} ${showPrices ? styling.active : ""}`}
        onClick={handleShowPrices}
      >
        <h4>
          <Trans>Prices</Trans>
        </h4>
        <h4>{showPrices ? <UpOutlined /> : <DownOutlined />}</h4>
        {showPrices && (
          <div className={styling.dropdown}>
            <Radio.Group
              value={selectedPriceFilter}
              onChange={(e) => {
                handlePriceFilterSelection(e.target.value);
                handlePriceFilter(e);
              }}
            >
              {prices.map((price) => (
                <div key={price._id}>
                  <Radio value={price.array}>
                    <Trans>{price.name}</Trans>
                  </Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
        )}
      </div>
    </div>
  );
}
