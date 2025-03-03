const SearchBar = ({
  inputValues,
  handleSearchChange,
}: {
  inputValues: any;
  handleSearchChange: any;
}) => {
  return (
    <div className="searchbar">
      <input
        type="text"
        placeholder="Search Here..."
        value={inputValues.search || ""}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default SearchBar;
