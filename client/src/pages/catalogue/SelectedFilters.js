import styling from "./SelectedFilters.module.css";
import { CloseOutlined } from "@ant-design/icons";

export default function SelectedFilters({
  categories,
  prices,
  selectedFilter,
  setSelectedFilter,
  handleCategoryFilterSelection,
  handlePriceFilterSelection,
  handleCategoryFilter,
  handlePriceFilter,
}) {
  const handleRemoveFilter = (filter) => {
    const updatedFilters = selectedFilter?.filter((f) => f !== filter);
    setSelectedFilter(updatedFilters);

    categories.map((c) => {
      if (c.name === filter) {
        handleCategoryFilterSelection(c.name);
        handleCategoryFilter(false, c._id);
      }
      return null;
    });

    prices.map((p) => {
      const splitPrice = filter.split("€ - ");
      const priceArray = splitPrice.map((price) => parseInt(price, 10));
      // console.log("priceArray", priceArray);

      if (p.array[0] === priceArray[0] && p.array[1] === priceArray[1]) {
        console.log("p.array[0]", p.array[0]);
        handlePriceFilterSelection("");
        handlePriceFilter({ target: { value: "" } });
      }

      return null;
    });
  };

  return (
    <div className={styling.selectedFilter}>
      {selectedFilter.map((filter) => (
        <div className={styling.filter} key={filter}>
          <span>{filter}</span>
          <span
            className={styling.close}
            onClick={() => handleRemoveFilter(filter)}
          >
            <CloseOutlined />
          </span>
        </div>
      ))}
    </div>
  );
}
