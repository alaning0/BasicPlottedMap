// Main export for BasicPlottedMap React component
export { BasicPlottedMap as default } from './components/BasicPlottedMap';
export { BasicPlottedMap } from './components/BasicPlottedMap';

// Export types for consumers
export type { 
  MapPoint, 
  PointDetails, 
  PointDetailProperty, 
  NearbyPoint, 
  MapCenter, 
  BasicPlottedMapProps 
} from './types';

// Export utility functions that might be useful
export { 
  calculateDistance, 
  findNearbyPoints, 
  fetchMapPoints, 
  fetchPointDetails 
} from './utils/api';