import { delay } from '@/utils/delay';

let favorites = [];

export const favoriteService = {
  async getAll() {
    await delay(200);
    return [...favorites];
  },

  async add(propertyId, notes = '') {
    await delay(300);
    const existing = favorites.find(f => f.propertyId === propertyId);
    if (existing) {
      throw new Error('Property already in favorites');
    }
    
    const newFavorite = {
      Id: Math.max(...favorites.map(f => f.Id || 0), 0) + 1,
      propertyId,
      addedDate: new Date().toISOString(),
      notes
    };
    
    favorites.push(newFavorite);
    return { ...newFavorite };
  },

  async remove(propertyId) {
    await delay(200);
    const index = favorites.findIndex(f => f.propertyId === propertyId);
    if (index === -1) {
      throw new Error('Favorite not found');
    }
    
    favorites.splice(index, 1);
    return true;
  },

  async updateNotes(propertyId, notes) {
    await delay(200);
    const favorite = favorites.find(f => f.propertyId === propertyId);
    if (!favorite) {
      throw new Error('Favorite not found');
    }
    
    favorite.notes = notes;
    return { ...favorite };
  },

  async isFavorite(propertyId) {
    await delay(100);
    return favorites.some(f => f.propertyId === propertyId);
  }
};