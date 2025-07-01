import React from 'react';
import './SearchButton.css';

interface SearchButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const SearchButton: React.FC<SearchButtonProps> = ({
  onClick,
  disabled = false,
  children = "Search",
  variant = 'primary'
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`search-button search-button--${variant}`}
    >
      {children}
    </button>
  );
};

export default SearchButton; 