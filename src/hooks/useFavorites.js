import { useState, useEffect } from 'react';
import { favoriteService } from '@/services/api/favoriteService';
import { toast } from 'react-toastify';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadFavorites = async () => {
    try {
      const data = await favoriteService.getAll();
      setFavorites(data);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const addFavorite = async (propertyId, notes = '') => {
    setLoading(true);
    try {
      const newFavorite = await favoriteService.add(propertyId, notes);
      setFavorites(prev => [...prev, newFavorite]);
      toast.success('Property added to favorites');
    } catch (error) {
      toast.error(error.message || 'Failed to add to favorites');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (propertyId) => {
    setLoading(true);
    try {
      await favoriteService.remove(propertyId);
      setFavorites(prev => prev.filter(f => f.propertyId !== propertyId));
      toast.success('Property removed from favorites');
    } catch (error) {
      toast.error(error.message || 'Failed to remove from favorites');
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (propertyId) => {
    return favorites.some(f => f.propertyId === propertyId);
  };

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
    refresh: loadFavorites
  };
};