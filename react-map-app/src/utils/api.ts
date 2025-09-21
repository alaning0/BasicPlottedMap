import { MapPoint, PointDetails } from '../types';

// Base URL for API calls (can be configured via environment variables)
const API_BASE_URL = 'http://localhost:8000';

// API function to get points data from server
export async function fetchMapPoints(): Promise<MapPoint[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/points`);
    if (!response.ok) {
      throw new Error(`Failed to fetch map points: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching map points:', error);
    throw error;
  }
}

// API function to get point details from server
export async function fetchPointDetails(pointId: number): Promise<PointDetails> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/points/${pointId}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Point details not found for ID: ${pointId}`);
      }
      throw new Error(`Failed to fetch point details: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching point details:', error);
    throw error;
  }
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