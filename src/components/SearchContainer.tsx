import React, { useState } from 'react';
import SearchBar from './SearchBar';
import SearchButton from './SearchButton';
import './SearchContainer.css';

interface SearchContainerProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  buttonText?: string;
  buttonVariant?: 'primary' | 'secondary';
}

const SearchContainer: React.FC<SearchContainerProps> = ({
  onSearch,
  placeholder = "Search NFTs...",
  buttonText = "Search",
  buttonVariant = 'primary'
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch?.(searchQuery.trim());
    }
  };

  const handleSearchFromBar = (query: string) => {
    if (query.trim()) {
      onSearch?.(query.trim());
    }
  };

  return (
    <div className="search-container">
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onSearch={handleSearchFromBar}
        placeholder={placeholder}
      />
      <SearchButton
        onClick={handleSearch}
        variant={buttonVariant}
        disabled={!searchQuery.trim()}
      >
        {buttonText}
      </SearchButton>
    </div>
  );
};

export default SearchContainer; 