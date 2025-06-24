import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50 px-4 -mx-4"
      >
        <h3 className="font-medium text-gray-900">{title}</h3>
        <ApperIcon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          className="w-4 h-4 text-gray-400" 
        />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PriceRangeFilter = ({ priceMin, priceMax, onChange }) => {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Input
          type="number"
          placeholder="Min Price"
          value={priceMin || ''}
          onChange={(e) => onChange({ priceMin: e.target.value ? parseInt(e.target.value) : null })}
        />
        <Input
          type="number"
          placeholder="Max Price"
          value={priceMax || ''}
          onChange={(e) => onChange({ priceMax: e.target.value ? parseInt(e.target.value) : null })}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'Under $500K', max: 500000 },
          { label: '$500K - $750K', min: 500000, max: 750000 },
          { label: '$750K - $1M', min: 750000, max: 1000000 },
          { label: 'Over $1M', min: 1000000 }
        ].map((range) => (
          <Button
            key={range.label}
            variant="ghost"
            size="sm"
            onClick={() => onChange({ priceMin: range.min || null, priceMax: range.max || null })}
            className="text-xs border border-gray-200 hover:border-primary"
          >
            {range.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

const PropertyTypeFilter = ({ selectedTypes, onChange }) => {
  const types = ['Single Family', 'Condo', 'Townhouse', 'Multi-Family'];

  const handleTypeToggle = (type) => {
    const newTypes = selectedTypes?.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...(selectedTypes || []), type];
    onChange({ propertyTypes: newTypes });
  };

  return (
    <div className="space-y-2">
      {types.map((type) => (
        <label key={type} className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedTypes?.includes(type) || false}
            onChange={() => handleTypeToggle(type)}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-sm text-gray-700">{type}</span>
        </label>
      ))}
    </div>
  );
};

const BedroomBathroomFilter = ({ bedroomsMin, bathroomsMin, onChange }) => {
  const options = [1, 2, 3, 4, 5];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Minimum Bedrooms
        </label>
        <div className="flex flex-wrap gap-2">
          {options.map((num) => (
            <Button
              key={`bed-${num}`}
              variant={bedroomsMin === num ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onChange({ bedroomsMin: bedroomsMin === num ? null : num })}
              className="w-10 h-10 border border-gray-200"
            >
              {num}
            </Button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Minimum Bathrooms
        </label>
        <div className="flex flex-wrap gap-2">
          {options.map((num) => (
            <Button
              key={`bath-${num}`}
              variant={bathroomsMin === num ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onChange({ bathroomsMin: bathroomsMin === num ? null : num })}
              className="w-10 h-10 border border-gray-200"
            >
              {num}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

const AmenitiesFilter = ({ selectedAmenities, onChange }) => {
  const amenities = [
    'Swimming Pool', 'Garage', 'Fireplace', 'Garden', 'Deck',
    'Mountain Views', 'City Views', 'Hardwood Floors', 'Updated Kitchen',
    'Central Air', 'Walk-in Closets', 'Basement'
  ];

  const handleAmenityToggle = (amenity) => {
    const newAmenities = selectedAmenities?.includes(amenity)
      ? selectedAmenities.filter(a => a !== amenity)
      : [...(selectedAmenities || []), amenity];
    onChange({ amenities: newAmenities });
  };

  return (
    <div className="space-y-2 max-h-48 overflow-y-auto">
      {amenities.map((amenity) => (
        <label key={amenity} className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedAmenities?.includes(amenity) || false}
            onChange={() => handleAmenityToggle(amenity)}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-sm text-gray-700">{amenity}</span>
        </label>
      ))}
    </div>
  );
};

export {
  FilterSection,
  PriceRangeFilter,
  PropertyTypeFilter,
  BedroomBathroomFilter,
  AmenitiesFilter
};