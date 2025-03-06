const SearchBar = ({ handleSearchChange }: { handleSearchChange: any }) => {
  return (
    <div className="searchbar">
      <input
        type="text"
        placeholder="Search Here..."
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default SearchBar;
