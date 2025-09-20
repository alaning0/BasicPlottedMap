import { MapPoint, PointDetails } from '../types';
import { mockMapPoints, mockPointDetails } from '../data/mockData';

// Mock API function to get points data
export async function fetchMapPoints(): Promise<MapPoint[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockMapPoints;
}

// Mock API function to get point details
export async function fetchPointDetails(pointId: number): Promise<PointDetails> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const details = mockPointDetails[pointId];
  if (!details) {
    throw new Error(`Point details not found for ID: ${pointId}`);
  }
  
  return details;
}

// Calculate distance between two coordinates using Haversine formula
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return Math.round(distance);
}

// Find nearby points within a specified radius
export function findNearbyPoints(
  allPoints: MapPoint[],
  centerPoint: MapPoint,
  radiusKm: number = 200
): MapPoint[] {
  return allPoints
    .filter(point => point.id !== centerPoint.id)
    .map(point => ({
      ...point,
      distance: calculateDistance(centerPoint.lat, centerPoint.lng, point.lat, point.lng)
    }))
    .filter(point => (point as any).distance <= radiusKm)
    .sort((a, b) => (a as any).distance - (b as any).distance);
}