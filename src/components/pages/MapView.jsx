import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { propertyService } from '@/services/api/propertyService';
import PropertyMap from '@/components/organisms/PropertyMap';
import PropertyCard from '@/components/molecules/PropertyCard';
import SearchFilters from '@/components/organisms/SearchFilters';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const MapView = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showPropertyPanel, setShowPropertyPanel] = useState(false);
  
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

  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
    setShowPropertyPanel(true);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
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
  };

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load map</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <Button onClick={loadProperties} icon="RefreshCw">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] relative overflow-hidden">
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <Button
          variant="primary"
          onClick={() => setShowFilters(true)}
          icon="Filter"
          className="shadow-lg"
        >
          Filters
        </Button>
        
        {loading && (
          <div className="bg-white rounded-lg shadow-lg p-3 flex items-center gap-2">
            <ApperIcon name="Loader2" className="w-4 h-4 animate-spin text-primary" />
            <span className="text-sm text-gray-600">Loading properties...</span>
          </div>
        )}
      </div>

      {/* Results Counter */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-white rounded-lg shadow-lg px-4 py-2">
          <span className="text-sm font-medium text-gray-900">
            {properties.length} Properties
          </span>
        </div>
      </div>

      {/* Map */}
      <PropertyMap
        properties={properties}
        selectedProperty={selectedProperty}
        onPropertySelect={handlePropertySelect}
        className="w-full h-full"
      />

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50"
          onClick={() => setShowFilters(false)}
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-white overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Map Filters</h2>
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

      {/* Selected Property Panel */}
      {showPropertyPanel && selectedProperty && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Selected Property</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/property/${selectedProperty.Id}`)}
                  icon="ExternalLink"
                >
                  View Details
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPropertyPanel(false)}
                  icon="X"
                />
              </div>
            </div>
            
            <div className="max-w-2xl">
              <PropertyCard property={selectedProperty} viewMode="list" />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MapView;