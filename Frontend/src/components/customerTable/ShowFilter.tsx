import { FiFilter } from "react-icons/fi";

const ShowFilter = ({
  setShowFilters,
  showFilters,
}: {
  setShowFilters: any;
  showFilters: any;
}) => {
  return (
    <div
      className="filter-icon-container"
      onClick={() => setShowFilters(!showFilters)}
    >
      <FiFilter className="filter-icon" />
      <span className="filter-text">Filters</span>
    </div>
  );
};

export default ShowFilter;
