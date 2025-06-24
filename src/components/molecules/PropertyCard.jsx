import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import NeighborhoodStats from '@/components/molecules/NeighborhoodStats';
import { useFavorites } from '@/hooks/useFavorites';
const PropertyCard = ({ property, viewMode = 'grid' }) => {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const isPropertyFavorite = isFavorite(property.Id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isPropertyFavorite) {
      removeFavorite(property.Id);
    } else {
      addFavorite(property.Id);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="property-card bg-surface rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <Link to={`/property/${property.Id}`} className="flex flex-col sm:flex-row">
          <div className="relative sm:w-80 flex-shrink-0">
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-48 sm:h-full object-cover"
            />
            <Badge 
              variant="accent" 
              className="absolute top-3 left-3"
            >
              {property.status}
            </Badge>
          </div>
          
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-xl font-display font-semibold text-gray-900 mb-1">
                  {property.title}
                </h3>
                <p className="text-gray-600 flex items-center gap-1">
                  <ApperIcon name="MapPin" className="w-4 h-4" />
                  {property.address}, {property.city}, {property.state}
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleFavoriteClick}
                className="favorite-btn p-2 rounded-full hover:bg-gray-100"
              >
                <ApperIcon 
                  name="Heart" 
                  className={`w-5 h-5 favorite-heart ${
                    isPropertyFavorite ? 'fill-accent text-accent' : 'text-gray-400'
                  }`}
                />
              </motion.button>
            </div>

            <div className="text-2xl font-bold text-primary mb-4">
              {formatPrice(property.price)}
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <ApperIcon name="Bed" className="w-4 h-4" />
                {property.bedrooms} beds
              </div>
              <div className="flex items-center gap-1">
                <ApperIcon name="Bath" className="w-4 h-4" />
                {property.bathrooms} baths
              </div>
              <div className="flex items-center gap-1">
                <ApperIcon name="Square" className="w-4 h-4" />
                {property.squareFeet?.toLocaleString()} sqft
              </div>
            </div>

<p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {property.description}
            </p>

            {property.neighborhoodStats && (
              <div className="mb-3">
                <NeighborhoodStats stats={property.neighborhoodStats} />
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Listed {formatDate(property.listingDate)}</span>
              <Badge variant="primary">{property.propertyType}</Badge>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="property-card bg-surface rounded-lg shadow-sm border border-gray-200 overflow-hidden"
    >
      <Link to={`/property/${property.Id}`}>
        <div className="relative">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-48 object-cover"
          />
          <Badge 
            variant="accent" 
            className="absolute top-3 left-3"
          >
            {property.status}
          </Badge>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleFavoriteClick}
            className="favorite-btn absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-sm"
          >
            <ApperIcon 
              name="Heart" 
              className={`w-4 h-4 favorite-heart ${
                isPropertyFavorite ? 'fill-accent text-accent' : 'text-gray-600'
              }`}
            />
          </motion.button>
        </div>
        
        <div className="p-4">
          <div className="text-2xl font-bold text-primary mb-2">
            {formatPrice(property.price)}
          </div>
          
          <h3 className="font-display font-semibold text-gray-900 mb-1 line-clamp-1">
            {property.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 flex items-center gap-1">
            <ApperIcon name="MapPin" className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{property.address}, {property.city}</span>
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <ApperIcon name="Bed" className="w-4 h-4" />
                {property.bedrooms}
              </div>
              <div className="flex items-center gap-1">
                <ApperIcon name="Bath" className="w-4 h-4" />
                {property.bathrooms}
              </div>
              <div className="flex items-center gap-1">
                <ApperIcon name="Square" className="w-4 h-4" />
                {property.squareFeet?.toLocaleString()}
              </div>
</div>
          </div>
          
          {property.neighborhoodStats && (
            <div className="px-4 pb-3">
              <NeighborhoodStats stats={property.neighborhoodStats} />
            </div>
          )}
          
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between">
              <Badge variant="primary" size="sm">
                {property.propertyType}
              </Badge>
              <span className="text-xs text-gray-500">
                Listed {formatDate(property.listingDate)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;