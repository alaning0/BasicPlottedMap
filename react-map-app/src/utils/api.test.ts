import { 
  fetchMapPoints, 
  fetchPointDetails, 
  calculateDistance, 
  findNearbyPoints 
} from './api';
import { MapPoint } from '../types';

// Mock the data modules
jest.mock('../data/mockData', () => ({
  mockMapPoints: [
    {
      id: 1,
      name: 'New York City',
      lat: 40.7128,
      lng: -74.0060,
      type: 'city',
      description: 'The largest city in the United States'
    },
    {
      id: 2,
      name: 'London',
      lat: 51.5074,
      lng: -0.1278,
      type: 'city',
      description: 'Capital of the United Kingdom'
    }
  ],
  mockPointDetails: {
    1: {
      title: 'New York City Details',
      description: 'Test description',
      data: [
        { property: 'Population', value: '8.3 million' }
      ]
    }
  }
}));

describe('API Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchMapPoints', () => {
    test('returns array of map points', async () => {
      const result = await fetchMapPoints();
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('lat');
      expect(result[0]).toHaveProperty('lng');
    });

    test('simulates API delay', async () => {
      const startTime = Date.now();
      await fetchMapPoints();
      const endTime = Date.now();
      const duration = endTime - startTime;
      expect(duration).toBeGreaterThanOrEqual(500);
    });
  });

  describe('fetchPointDetails', () => {
    test('returns point details for valid ID', async () => {
      const result = await fetchPointDetails(1);
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('data');
      expect(result.title).toBe('New York City Details');
    });

    test('throws error for invalid ID', async () => {
      await expect(fetchPointDetails(999)).rejects.toThrow('Point details not found for ID: 999');
    });

    test('simulates API delay', async () => {
      const startTime = Date.now();
      await fetchPointDetails(1);
      const endTime = Date.now();
      const duration = endTime - startTime;
      expect(duration).toBeGreaterThanOrEqual(300);
    });
  });

  describe('calculateDistance', () => {
    test('calculates distance between two points correctly', () => {
      // Distance between New York and London is approximately 5585 km
      const distance = calculateDistance(40.7128, -74.0060, 51.5074, -0.1278);
      expect(distance).toBeCloseTo(5585, -2); // Within 100km tolerance
    });

    test('returns 0 for same coordinates', () => {
      const distance = calculateDistance(40.7128, -74.0060, 40.7128, -74.0060);
      expect(distance).toBe(0);
    });

    test('returns positive distance for different coordinates', () => {
      const distance = calculateDistance(0, 0, 1, 1);
      expect(distance).toBeGreaterThan(0);
    });

    test('returns integer distance (rounded)', () => {
      const distance = calculateDistance(40.7128, -74.0060, 40.7129, -74.0061);
      expect(Number.isInteger(distance)).toBe(true);
    });
  });

  describe('findNearbyPoints', () => {
    const testPoints: MapPoint[] = [
      {
        id: 1,
        name: 'Center Point',
        lat: 40.7128,
        lng: -74.0060,
        type: 'city',
        description: 'Center'
      },
      {
        id: 2,
        name: 'Nearby Point',
        lat: 40.7500,
        lng: -74.0000,
        type: 'city',
        description: 'Close by'
      },
      {
        id: 3,
        name: 'Far Point',
        lat: 51.5074,
        lng: -0.1278,
        type: 'city',
        description: 'Very far'
      }
    ];

    test('excludes center point from results', () => {
      const centerPoint = testPoints[0];
      const results = findNearbyPoints(testPoints, centerPoint, 1000);
      
      expect(results).not.toContainEqual(expect.objectContaining({ id: centerPoint.id }));
    });

    test('filters points by radius', () => {
      const centerPoint = testPoints[0];
      const results = findNearbyPoints(testPoints, centerPoint, 100); // Small radius
      
      // Should only include nearby point, not the far London point
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe(2);
    });

    test('sorts results by distance', () => {
      const centerPoint = testPoints[0];
      const results = findNearbyPoints(testPoints, centerPoint, 10000); // Large radius
      
      expect(results).toHaveLength(2);
      // First result should be closer than second
      expect((results[0] as any).distance).toBeLessThan((results[1] as any).distance);
    });

    test('adds distance property to results', () => {
      const centerPoint = testPoints[0];
      const results = findNearbyPoints(testPoints, centerPoint, 1000);
      
      results.forEach(point => {
        expect(point).toHaveProperty('distance');
        expect(typeof (point as any).distance).toBe('number');
        expect((point as any).distance).toBeGreaterThan(0);
      });
    });

    test('returns empty array when no points within radius', () => {
      const centerPoint = testPoints[0];
      const results = findNearbyPoints(testPoints, centerPoint, 1); // Very small radius
      
      expect(results).toHaveLength(0);
    });

    test('uses default radius when not specified', () => {
      const centerPoint = testPoints[0];
      const results = findNearbyPoints(testPoints, centerPoint);
      
      // Should use default radius of 200km
      expect(results).toHaveLength(1); // Only nearby point within 200km
    });
  });
});