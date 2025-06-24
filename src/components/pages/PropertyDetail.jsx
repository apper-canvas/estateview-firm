import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { propertyService } from '@/services/api/propertyService';
import PhotoGallery from '@/components/molecules/PhotoGallery';
import PropertyDetails from '@/components/organisms/PropertyDetails';
import ContactForm from '@/components/organisms/ContactForm';
import PropertyMap from '@/components/organisms/PropertyMap';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { useFavorites } from '@/hooks/useFavorites';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const isPropertyFavorite = property ? isFavorite(property.Id) : false;

  useEffect(() => {
    const loadProperty = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await propertyService.getById(id);
        setProperty(data);
      } catch (err) {
        setError(err.message || 'Property not found');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProperty();
    }
  }, [id]);

  const handleFavoriteToggle = () => {
    if (!property) return;
    
    if (isPropertyFavorite) {
      removeFavorite(property.Id);
    } else {
      addFavorite(property.Id);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          {/* Header skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-8 bg-gray-200 rounded w-32"></div>
            <div className="flex gap-2">
              <div className="h-10 bg-gray-200 rounded w-24"></div>
              <div className="h-10 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          
          {/* Gallery skeleton */}
          <div className="h-96 bg-gray-200 rounded-lg"></div>
          
          {/* Content skeleton */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="grid grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <ApperIcon name="Home" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Property not found</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <Button onClick={() => navigate('/')} icon="ArrowLeft">
            Back to Search
          </Button>
        </div>
      </div>
    );
  }

  if (!property) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          icon="ArrowLeft"
          className="text-gray-600 hover:text-gray-900"
        >
          Back
        </Button>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon="Share"
            onClick={() => navigator.share && navigator.share({
              title: property.title,
              url: window.location.href
            })}
          >
            Share
          </Button>
          <Button
            variant={isPropertyFavorite ? 'accent' : 'outline'}
            icon="Heart"
            onClick={handleFavoriteToggle}
            className={isPropertyFavorite ? 'text-white' : ''}
          >
            {isPropertyFavorite ? 'Saved' : 'Save'}
          </Button>
        </div>
      </motion.div>

      {/* Photo Gallery */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <PhotoGallery images={property.images} title={property.title} />
      </motion.div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Property Details */}
        <div className="lg:col-span-2">
          <PropertyDetails property={property} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Form */}
          <ContactForm property={property} />
          
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ApperIcon name="MapPin" className="w-5 h-5" />
              Location
            </h3>
            <PropertyMap
              properties={[property]}
              selectedProperty={property}
              className="h-64"
            />
            <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <ApperIcon name="MapPin" className="w-4 h-4" />
                <span>{property.address}, {property.city}, {property.state} {property.zipCode}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyDetail;