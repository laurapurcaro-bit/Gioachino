import styling from "./SelectedFilters.module.css";
import { CloseOutlined } from "@ant-design/icons";

export default function SelectedFilters({ selectedFilter, setSelectedFilter }) {
  const handleRemoveFilter = (filter) => {
    const updatedFilters = selectedFilter.filter((f) => f !== filter);
    setSelectedFilter(updatedFilters);
  };

  return (
    <div className={styling.selectedFilter}>
      {selectedFilter.map((filter) => (
        <div className={styling.filter} key={filter}>
          <span>{filter}</span>
          <span className={styling.close} onClick={() => handleRemoveFilter(filter)}><CloseOutlined /></span>
        </div>
      ))}
    </div>
  );
}
