import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { propertyService } from '@/services/api/propertyService';
import { useFavorites } from '@/hooks/useFavorites';
import PropertyGrid from '@/components/organisms/PropertyGrid';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const SavedProperties = () => {
  const { favorites, loading: favoritesLoading } = useFavorites();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const loadSavedProperties = async () => {
      if (favorites.length === 0) {
        setProperties([]);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const propertyIds = favorites.map(f => f.propertyId);
        const data = await propertyService.getByIds(propertyIds);
        setProperties(data);
      } catch (err) {
        setError(err.message || 'Failed to load saved properties');
      } finally {
        setLoading(false);
      }
    };

    loadSavedProperties();
  }, [favorites]);

  if (favoritesLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-surface rounded-lg border border-gray-200 overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load saved properties</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()} icon="RefreshCw">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="Heart" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No saved properties yet</h3>
          <p className="text-gray-500 mb-6">
            Start browsing properties and save your favorites to see them here.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => window.location.href = '/'}
              icon="Search"
            >
              Browse Properties
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Properties</h1>
        <p className="text-gray-600">
          Properties you've saved for future reference
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <PropertyGrid
          properties={properties}
          viewMode={viewMode}
          loading={false}
          onViewModeChange={setViewMode}
        />
      </motion.div>
    </div>
  );
};

export default SavedProperties;