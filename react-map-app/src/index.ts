// Main export for BasicPlottedMap React component
import BasicPlottedMap from './components/BasicPlottedMap';
export default BasicPlottedMap;
export { default as BasicPlottedMap } from './components/BasicPlottedMap';

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