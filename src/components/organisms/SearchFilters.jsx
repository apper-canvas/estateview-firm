import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import {
  FilterSection,
  PriceRangeFilter,
  PropertyTypeFilter,
  BedroomBathroomFilter,
  AmenitiesFilter
} from '@/components/molecules/FilterSection';

const SearchFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  className = '' 
}) => {
  const hasActiveFilters = Object.values(filters).some(value => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== null && value !== undefined && value !== '';
  });

  return (
    <div className={`bg-surface rounded-lg border border-gray-200 ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ApperIcon name="Filter" className="w-5 h-5" />
            Filters
          </h2>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-primary hover:bg-primary/10"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      <div className="filter-sidebar p-4 space-y-4 max-h-96 overflow-y-auto">
        <FilterSection title="Keywords" defaultOpen={false}>
          <Input
            type="text"
            placeholder="Search keywords..."
            icon="Search"
            value={filters.keywords || ''}
            onChange={(e) => onFilterChange({ keywords: e.target.value })}
          />
        </FilterSection>

        <FilterSection title="Price Range">
          <PriceRangeFilter
            priceMin={filters.priceMin}
            priceMax={filters.priceMax}
            onChange={onFilterChange}
          />
        </FilterSection>

        <FilterSection title="Property Type">
          <PropertyTypeFilter
            selectedTypes={filters.propertyTypes}
            onChange={onFilterChange}
          />
        </FilterSection>

        <FilterSection title="Bedrooms & Bathrooms">
          <BedroomBathroomFilter
            bedroomsMin={filters.bedroomsMin}
            bathroomsMin={filters.bathroomsMin}
            onChange={onFilterChange}
          />
        </FilterSection>

        <FilterSection title="Square Footage" defaultOpen={false}>
          <Input
            type="number"
            placeholder="Minimum Square Feet"
            value={filters.squareFeetMin || ''}
            onChange={(e) => onFilterChange({ 
              squareFeetMin: e.target.value ? parseInt(e.target.value) : null 
            })}
          />
        </FilterSection>

        <FilterSection title="Amenities" defaultOpen={false}>
          <AmenitiesFilter
            selectedAmenities={filters.amenities}
            onChange={onFilterChange}
          />
        </FilterSection>
      </div>
    </div>
  );
};

export default SearchFilters;