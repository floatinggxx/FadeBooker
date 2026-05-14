import React from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={(event) => onChange(event.target.value)}
    placeholder={placeholder}
    className="input-field"
  />
);

export default SearchInput;
