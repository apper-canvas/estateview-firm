import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

const SearchBar = ({ onSearch, className = '' }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        // Navigate to search results with query
        const searchParams = new URLSearchParams();
        searchParams.set('q', query.trim());
        navigate(`/?${searchParams.toString()}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Search by location, property type, or keywords..."
          icon="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full"
        />
      </div>
      <Button type="submit" disabled={!query.trim()}>
        Search
      </Button>
    </form>
  );
};

export default SearchBar;