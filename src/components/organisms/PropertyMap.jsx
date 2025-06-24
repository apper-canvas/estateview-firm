import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom property marker icon
const createPropertyIcon = (color = 'primary') => {
  const colors = {
    primary: '#2C5F2D',
    accent: '#EDC948',
    featured: '#97BC62'
  };

  return L.divIcon({
    html: `
      <div style="
        background-color: ${colors[color]};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          color: white;
          font-size: 12px;
          font-weight: bold;
          transform: rotate(45deg);
        ">$</div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
    className: 'custom-property-marker'
  });
};

const PropertyMap = ({ properties, selectedProperty, onPropertySelect, className = '' }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Calculate map center based on properties
  const getMapCenter = () => {
    if (!properties || properties.length === 0) {
      return [39.7392, -104.9903]; // Default to Denver
    }

    if (selectedProperty && selectedProperty.coordinates) {
      return [selectedProperty.coordinates.lat, selectedProperty.coordinates.lng];
    }

    const validProperties = properties.filter(p => p.coordinates);
    if (validProperties.length === 0) {
      return [39.7392, -104.9903];
    }

    const avgLat = validProperties.reduce((sum, p) => sum + p.coordinates.lat, 0) / validProperties.length;
    const avgLng = validProperties.reduce((sum, p) => sum + p.coordinates.lng, 0) / validProperties.length;
    
    return [avgLat, avgLng];
  };

  const mapCenter = getMapCenter();
  const zoom = selectedProperty ? 15 : 11;

  if (!properties || properties.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center py-12">
          <ApperIcon name="Map" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No properties to display on map</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg overflow-hidden border border-gray-200 ${className}`}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        className="w-full h-full min-h-[400px]"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {properties
          .filter(property => property.coordinates)
          .map((property) => {
            const iconColor = property.status === 'featured' ? 'featured' : 
                            property.Id === selectedProperty?.Id ? 'accent' : 'primary';
            
            return (
              <Marker
                key={property.Id}
                position={[property.coordinates.lat, property.coordinates.lng]}
                icon={createPropertyIcon(iconColor)}
                eventHandlers={{
                  click: () => onPropertySelect && onPropertySelect(property)
                }}
              >
                <Popup className="property-popup">
                  <div className="min-w-[250px] p-2">
                    <div className="relative mb-3">
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Badge 
                        variant="accent" 
                        className="absolute top-2 left-2"
                        size="sm"
                      >
                        {property.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-lg font-bold text-primary">
                        {formatPrice(property.price)}
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 line-clamp-1">
                        {property.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <ApperIcon name="MapPin" className="w-3 h-3" />
                        {property.address}, {property.city}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <ApperIcon name="Bed" className="w-3 h-3" />
                          {property.bedrooms}
                        </div>
                        <div className="flex items-center gap-1">
                          <ApperIcon name="Bath" className="w-3 h-3" />
                          {property.bathrooms}
                        </div>
                        <div className="flex items-center gap-1">
                          <ApperIcon name="Square" className="w-3 h-3" />
                          {property.squareFeet?.toLocaleString()}
                        </div>
                      </div>
                      
                      <a
                        href={`/property/${property.Id}`}
                        className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Details
                        <ApperIcon name="ArrowRight" className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
};

export default PropertyMap;