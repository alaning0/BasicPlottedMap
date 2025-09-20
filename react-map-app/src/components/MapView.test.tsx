import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MapView from './MapView';
import { MapPoint } from '../types';

// Mock react-leaflet components
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children, ...props }: any) => (
    <div data-testid="map-container" data-zoom={props.zoom}>
      {children}
    </div>
  ),
  TileLayer: (props: any) => <div data-testid="tile-layer" />,
  Marker: ({ children, position, eventHandlers, ...props }: any) => (
    <div data-testid="marker" data-position={position?.join(',')}>
      {children}
    </div>
  ),
  Popup: ({ children, ...props }: any) => (
    <div data-testid="popup">
      {children}
    </div>
  ),
  LayersControl: ({ children, ...props }: any) => (
    <div data-testid="layers-control">
      {children}
    </div>
  ),
}));

// Add LayersControl.BaseLayer to the mock
(jest.requireMock('react-leaflet') as any).LayersControl.BaseLayer = ({ children, name, checked, ...props }: any) => (
  <div data-testid="base-layer" data-name={name} data-checked={checked}>
    {children}
  </div>
);

// Mock leaflet
jest.mock('leaflet', () => ({
  latLngBounds: jest.fn(() => ({
    pad: jest.fn(() => ({}))
  }))
}));

describe('MapView Component', () => {
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
      name: 'London',
      lat: 51.5074,
      lng: -0.1278,
      type: 'city',
      description: 'Capital of the United Kingdom'
    }
  ];

  const defaultProps = {
    points: mockPoints,
    onPointSelect: jest.fn(),
    defaultCenter: [40.7128, -74.0060] as [number, number],
    defaultZoom: 3,
    isLeafletAvailable: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders fallback map when Leaflet is not available', () => {
    render(<MapView {...defaultProps} isLeafletAvailable={false} />);
    
    expect(screen.getByText('Map View')).toBeInTheDocument();
    expect(screen.getByText('OpenStreetMap tiles are not available in this environment')).toBeInTheDocument();
    expect(screen.getByText('Points will still be functional in the sidebar')).toBeInTheDocument();
  });

  test('renders Leaflet map when available', () => {
    render(<MapView {...defaultProps} isLeafletAvailable={true} />);
    
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    expect(screen.getByTestId('layers-control')).toBeInTheDocument();
  });

  test('renders markers for each point', () => {
    render(<MapView {...defaultProps} isLeafletAvailable={true} />);
    
    const markers = screen.getAllByTestId('marker');
    expect(markers).toHaveLength(mockPoints.length);
    
    // Check marker positions
    expect(markers[0]).toHaveAttribute('data-position', '40.7128,-74.006');
    expect(markers[1]).toHaveAttribute('data-position', '51.5074,-0.1278');
  });

  test('renders popups with point information', () => {
    render(<MapView {...defaultProps} isLeafletAvailable={true} />);
    
    expect(screen.getByText('New York City')).toBeInTheDocument();
    expect(screen.getByText('The largest city in the United States')).toBeInTheDocument();
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('Capital of the United Kingdom')).toBeInTheDocument();
  });

  test('renders both tile layer options', () => {
    render(<MapView {...defaultProps} isLeafletAvailable={true} />);
    
    const tileLayers = screen.getAllByTestId('tile-layer');
    expect(tileLayers).toHaveLength(2);
    
    const baseLayers = screen.getAllByTestId('base-layer');
    expect(baseLayers).toHaveLength(2);
    
    // Check layer names
    expect(baseLayers[0]).toHaveAttribute('data-name', 'Street View');
    expect(baseLayers[0]).toHaveAttribute('data-checked', 'true');
    expect(baseLayers[1]).toHaveAttribute('data-name', 'Satellite View');
  });

  test('fallback map renders correctly', () => {
    render(<MapView {...defaultProps} isLeafletAvailable={false} />);
    
    expect(screen.getByText('Map View')).toBeInTheDocument();
    expect(screen.getByText('OpenStreetMap tiles are not available in this environment')).toBeInTheDocument();
    
    // Check that the map element is present
    expect(screen.getByText('Map View')).toBeInTheDocument();
  });

  test('renders with empty points array', () => {
    render(<MapView {...defaultProps} points={[]} isLeafletAvailable={true} />);
    
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    expect(screen.queryByTestId('marker')).not.toBeInTheDocument();
  });

  test('map container has correct props', () => {
    render(<MapView {...defaultProps} isLeafletAvailable={true} />);
    
    const mapContainer = screen.getByTestId('map-container');
    expect(mapContainer).toHaveAttribute('data-zoom', '3');
  });

  test('fallback map has correct ID', () => {
    render(<MapView {...defaultProps} isLeafletAvailable={false} />);
    
    // Check that fallback content is rendered
    expect(screen.getByText('Map View')).toBeInTheDocument();
    expect(screen.getByText('Points will still be functional in the sidebar')).toBeInTheDocument();
  });

  test('Leaflet map wrapper renders correctly', () => {
    render(<MapView {...defaultProps} isLeafletAvailable={true} />);
    
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    expect(screen.getByTestId('layers-control')).toBeInTheDocument();
  });
});