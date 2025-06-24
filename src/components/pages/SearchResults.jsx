import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { propertyService } from '@/services/api/propertyService';
import SearchFilters from '@/components/organisms/SearchFilters';
import PropertyGrid from '@/components/organisms/PropertyGrid';
import PropertyMap from '@/components/organisms/PropertyMap';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    keywords: '',
    priceMin: null,
    priceMax: null,
    propertyTypes: [],
    bedroomsMin: null,
    bathroomsMin: null,
    squareFeetMin: null,
    amenities: []
  });

  // Initialize filters from URL params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlFilters = {};
    
    if (searchParams.get('q')) {
      urlFilters.keywords = searchParams.get('q');
    }
    if (searchParams.get('priceMin')) {
      urlFilters.priceMin = parseInt(searchParams.get('priceMin'));
    }
    if (searchParams.get('priceMax')) {
      urlFilters.priceMax = parseInt(searchParams.get('priceMax'));
    }
    
    if (Object.keys(urlFilters).length > 0) {
      setFilters(prev => ({ ...prev, ...urlFilters }));
    }
  }, [location.search]);

  const loadProperties = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await propertyService.getAll(filters);
      setProperties(data);
    } catch (err) {
      setError(err.message || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    
    // Update URL with current filters
    const searchParams = new URLSearchParams();
    Object.entries({ ...filters, ...newFilters }).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '' && 
          (!Array.isArray(value) || value.length > 0)) {
        searchParams.set(key, Array.isArray(value) ? value.join(',') : value);
      }
    });
    
    navigate(`?${searchParams.toString()}`, { replace: true });
  };

  const handleClearFilters = () => {
    setFilters({
      keywords: '',
      priceMin: null,
      priceMax: null,
      propertyTypes: [],
      bedroomsMin: null,
      bathroomsMin: null,
      squareFeetMin: null,
      amenities: []
    });
    navigate('/', { replace: true });
  };

  const toggleView = () => {
    setShowMap(!showMap);
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load properties</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <Button onClick={loadProperties} icon="RefreshCw">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar - Desktop */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-6">
            <SearchFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden">
          <Button
            variant="outline"
            onClick={() => setShowFilters(true)}
            icon="Filter"
            className="mb-4"
          >
            Filters
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* View Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {location.pathname === '/rent' ? 'Rental Properties' : 'Properties for Sale'}
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={showMap ? 'primary' : 'outline'}
                onClick={toggleView}
                icon="Map"
                size="sm"
              >
                {showMap ? 'Hide Map' : 'Show Map'}
              </Button>
            </div>
          </div>

          {/* Content Area */}
          <div className={`${showMap ? 'grid lg:grid-cols-2 gap-6' : ''}`}>
            {/* Properties List/Grid */}
            <div className={showMap ? 'order-2 lg:order-1' : ''}>
              <PropertyGrid
                properties={properties}
                viewMode={viewMode}
                loading={loading}
                onViewModeChange={setViewMode}
              />
            </div>

            {/* Map */}
            {showMap && (
              <div className="order-1 lg:order-2 lg:sticky lg:top-6">
                <PropertyMap
                  properties={properties}
                  onPropertySelect={(property) => navigate(`/property/${property.Id}`)}
                  className="h-96 lg:h-[600px]"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setShowFilters(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                  icon="X"
                />
              </div>
            </div>
            <div className="p-4">
              <SearchFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchResults;