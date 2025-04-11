
 function SearchBar({ setSearchTerm }) {
    return (
      <div className="search">
      <input
        type="text"
        placeholder="Search blogs..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      </div>
    );
  }
  
  export default SearchBar;