import { delay } from '@/utils/delay';
import propertiesData from '@/services/mockData/properties.json';

let properties = [...propertiesData];

export const propertyService = {
  async getAll(filters = {}) {
    await delay(300);
    
    let filteredProperties = [...properties];
    
    // Apply filters
    if (filters.priceMin) {
      filteredProperties = filteredProperties.filter(p => p.price >= filters.priceMin);
    }
    if (filters.priceMax) {
      filteredProperties = filteredProperties.filter(p => p.price <= filters.priceMax);
    }
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      filteredProperties = filteredProperties.filter(p => 
        filters.propertyTypes.includes(p.propertyType)
      );
    }
    if (filters.bedroomsMin) {
      filteredProperties = filteredProperties.filter(p => p.bedrooms >= filters.bedroomsMin);
    }
    if (filters.bathroomsMin) {
      filteredProperties = filteredProperties.filter(p => p.bathrooms >= filters.bathroomsMin);
    }
    if (filters.squareFeetMin) {
      filteredProperties = filteredProperties.filter(p => p.squareFeet >= filters.squareFeetMin);
    }
    if (filters.keywords) {
      const keywords = filters.keywords.toLowerCase();
      filteredProperties = filteredProperties.filter(p => 
        p.title.toLowerCase().includes(keywords) ||
        p.address.toLowerCase().includes(keywords) ||
        p.city.toLowerCase().includes(keywords) ||
        p.description.toLowerCase().includes(keywords)
      );
    }
    if (filters.amenities && filters.amenities.length > 0) {
      filteredProperties = filteredProperties.filter(p =>
        filters.amenities.some(amenity => p.features.includes(amenity))
      );
    }
    
    return filteredProperties;
  },

  async getById(id) {
    await delay(200);
    const property = properties.find(p => p.Id === parseInt(id, 10));
    if (!property) {
      throw new Error('Property not found');
    }
    return { ...property };
  },

  async getFeatured() {
    await delay(250);
    return properties.filter(p => p.status === 'featured').slice(0, 6);
  },

  async getByIds(ids) {
    await delay(200);
    return properties.filter(p => ids.includes(p.Id));
  }
};