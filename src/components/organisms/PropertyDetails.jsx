import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

const PropertyDetails = ({ property }) => {
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
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const keyDetails = [
    { icon: 'Bed', label: 'Bedrooms', value: property.bedrooms },
    { icon: 'Bath', label: 'Bathrooms', value: property.bathrooms },
    { icon: 'Square', label: 'Square Feet', value: property.squareFeet?.toLocaleString() },
    { icon: 'Calendar', label: 'Year Built', value: property.yearBuilt },
    { icon: 'MapPin', label: 'Lot Size', value: `${property.lotSize} acres` },
    { icon: 'Home', label: 'Property Type', value: property.propertyType }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              {property.title}
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <ApperIcon name="MapPin" className="w-4 h-4" />
              {property.address}, {property.city}, {property.state} {property.zipCode}
            </p>
          </div>
          <Badge variant="accent" size="lg">
            {property.status}
          </Badge>
        </div>
        
        <div className="text-4xl font-bold text-primary mb-4">
          {formatPrice(property.price)}
        </div>
      </div>

      {/* Key Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {keyDetails.map((detail, index) => (
          <motion.div
            key={detail.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 rounded-lg p-4 text-center"
          >
            <ApperIcon name={detail.icon} className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-lg font-semibold text-gray-900">{detail.value}</div>
            <div className="text-sm text-gray-600">{detail.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Description */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
        <p className="text-gray-700 leading-relaxed">{property.description}</p>
      </div>

      {/* Features */}
      {property.features && property.features.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {property.features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-2 text-gray-700"
              >
                <ApperIcon name="Check" className="w-4 h-4 text-success" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Property History */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Information</h2>
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Listed Date</span>
            <span className="font-medium">{formatDate(property.listingDate)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Property Type</span>
            <Badge variant="primary">{property.propertyType}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Status</span>
            <Badge variant="accent">{property.status}</Badge>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyDetails;