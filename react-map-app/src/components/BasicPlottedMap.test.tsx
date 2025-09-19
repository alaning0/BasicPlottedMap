import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BasicPlottedMap from './BasicPlottedMap';
import * as api from '../utils/api';
import { MapPoint, PointDetails } from '../types';

// Mock the child components
jest.mock('./Header', () => {
  return function MockHeader({ onFindNearbyPoints, status, loading }: any) {
    return (
      <div data-testid="header">
        <button onClick={onFindNearbyPoints} disabled={loading}>
          Find Nearby Points
        </button>
        <span>{status}</span>
      </div>
    );
  };
});

jest.mock('./Sidebar', () => {
  return function MockSidebar({ pointDetails, loading }: any) {
    return (
      <div data-testid="sidebar">
        {loading ? 'Loading...' : pointDetails ? pointDetails.title : 'No details'}
      </div>
    );
  };
});

jest.mock('./MapView', () => {
  return function MockMapView({ points, onPointSelect }: any) {
    return (
      <div data-testid="map-view">
        {points.map((point: MapPoint) => (
          <button key={point.id} onClick={() => onPointSelect(point)}>
            {point.name}
          </button>
        ))}
      </div>
    );
  };
});

// Mock the API functions
jest.mock('../utils/api');
const mockApi = api as jest.Mocked<typeof api>;

describe('BasicPlottedMap Component', () => {
  const mockPoints: MapPoint[] = [
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
      name: 'Melbourne',
      lat: -37.8136,
      lng: 144.9631,
      type: 'city',
      description: 'Cultural capital of Australia'
    }
  ];

  const mockPointDetails: PointDetails = {
    title: 'New York City Details',
    description: 'Test description',
    data: [
      { property: 'Population', value: '8.3 million' }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockApi.fetchMapPoints.mockResolvedValue(mockPoints);
    mockApi.fetchPointDetails.mockResolvedValue(mockPointDetails);
    mockApi.findNearbyPoints.mockReturnValue([]);
  });

  test('renders all child components', async () => {
    render(<BasicPlottedMap />);
    
    await waitFor(() => {
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('map-view')).toBeInTheDocument();
    });
  });

  test('loads map points on mount', async () => {
    render(<BasicPlottedMap />);
    
    await waitFor(() => {
      expect(mockApi.fetchMapPoints).toHaveBeenCalledTimes(1);
    });
    
    expect(screen.getByText('New York City')).toBeInTheDocument();
    expect(screen.getByText('Melbourne')).toBeInTheDocument();
  });

  test('shows loading status while fetching points', async () => {
    // Make API call take longer
    mockApi.fetchMapPoints.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockPoints), 100))
    );
    
    render(<BasicPlottedMap />);
    
    expect(screen.getByText('Loading map points...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText(`Loaded ${mockPoints.length} points`)).toBeInTheDocument();
    });
  });

  test('handles point selection', async () => {
    const mockOnPointSelect = jest.fn();
    render(<BasicPlottedMap onPointSelect={mockOnPointSelect} />);
    
    await waitFor(() => {
      expect(screen.getByText('New York City')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('New York City'));
    
    await waitFor(() => {
      expect(mockOnPointSelect).toHaveBeenCalledWith(mockPoints[0]);
      expect(mockApi.fetchPointDetails).toHaveBeenCalledWith(1);
    });
  });

  test('displays point details after selection', async () => {
    render(<BasicPlottedMap />);
    
    await waitFor(() => {
      expect(screen.getByText('New York City')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('New York City'));
    
    await waitFor(() => {
      expect(screen.getByText('New York City Details')).toBeInTheDocument();
    });
  });

  test('handles nearby points search', async () => {
    mockApi.findNearbyPoints.mockReturnValue([mockPoints[1]]);
    
    render(<BasicPlottedMap />);
    
    // Wait for points to load first
    await waitFor(() => {
      expect(screen.getByText('New York City')).toBeInTheDocument();
    });
    
    // Select a point first (Melbourne is at index 1 in mockPoints)
    fireEvent.click(screen.getByText('Melbourne'));
    
    // Wait for point details to load
    await waitFor(() => {
      expect(screen.getByText('New York City Details')).toBeInTheDocument();
    });
    
    // Now test nearby points search
    fireEvent.click(screen.getByRole('button', { name: 'Find Nearby Points' }));
    
    await waitFor(() => {
      expect(mockApi.findNearbyPoints).toHaveBeenCalled();
    });
  });

  test('calls onStatusChange callback', async () => {
    const mockOnStatusChange = jest.fn();
    render(<BasicPlottedMap onStatusChange={mockOnStatusChange} />);
    
    await waitFor(() => {
      expect(mockOnStatusChange).toHaveBeenCalledWith('Loading map points...');
    });
    
    await waitFor(() => {
      expect(mockOnStatusChange).toHaveBeenCalledWith(`Loaded ${mockPoints.length} points`);
    });
  });

  test('handles API errors gracefully', async () => {
    mockApi.fetchMapPoints.mockRejectedValue(new Error('API Error'));
    
    render(<BasicPlottedMap />);
    
    await waitFor(() => {
      expect(screen.getByText('Error loading points')).toBeInTheDocument();
    });
  });

  test('handles point details API error', async () => {
    mockApi.fetchPointDetails.mockRejectedValue(new Error('Details not found'));
    
    render(<BasicPlottedMap />);
    
    await waitFor(() => {
      expect(screen.getByText('New York City')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('New York City'));
    
    await waitFor(() => {
      expect(screen.getByText('Error loading details')).toBeInTheDocument();
    });
  });

  test('accepts custom props', async () => {
    const customProps = {
      className: 'custom-class',
      defaultCenter: [51.5074, -0.1278] as [number, number],
      defaultZoom: 5,
    };
    
    const { container } = render(<BasicPlottedMap {...customProps} />);
    
    expect(container.firstChild).toHaveClass('container', 'custom-class');
  });

  test('uses default props when not provided', async () => {
    const { container } = render(<BasicPlottedMap />);
    
    expect(container.firstChild).toHaveClass('container');
    expect(container.firstChild).not.toHaveClass('custom-class');
  });

  test('disables nearby button while loading', async () => {
    // Make point details API call take longer
    mockApi.fetchPointDetails.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockPointDetails), 100))
    );
    
    render(<BasicPlottedMap />);
    
    await waitFor(() => {
      expect(screen.getByText('New York City')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('New York City'));
    
    // Button should be disabled while loading point details
    expect(screen.getByRole('button', { name: 'Find Nearby Points' })).toBeDisabled();
  });
});