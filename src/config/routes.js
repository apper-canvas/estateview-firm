import SearchResults from '@/components/pages/SearchResults';
import PropertyDetail from '@/components/pages/PropertyDetail';
import SavedProperties from '@/components/pages/SavedProperties';
import MapView from '@/components/pages/MapView';

export const routes = {
  search: {
    id: 'search',
    label: 'Buy',
    path: '/',
    icon: 'Search',
    component: SearchResults
  },
  rent: {
    id: 'rent', 
    label: 'Rent',
    path: '/rent',
    icon: 'Home',
    component: SearchResults
  },
  saved: {
    id: 'saved',
    label: 'Saved',
    path: '/saved',
    icon: 'Heart',
    component: SavedProperties
  },
  map: {
    id: 'map',
    label: 'Map View',
    path: '/map',
    icon: 'Map',
    component: MapView
  },
  property: {
    id: 'property',
    label: 'Property Detail',
    path: '/property/:id',
    icon: 'Home',
    component: PropertyDetail,
    hidden: true
  }
};

export const routeArray = Object.values(routes);
export default routes;