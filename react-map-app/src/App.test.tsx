import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the BasicPlottedMap component and its dependencies
jest.mock('./components/BasicPlottedMap', () => {
  return function MockBasicPlottedMap() {
    return <div data-testid="basic-plotted-map">Mocked BasicPlottedMap</div>;
  };
});

// Mock react-leaflet to avoid import issues
jest.mock('react-leaflet', () => ({
  MapContainer: () => <div>MapContainer</div>,
  TileLayer: () => <div>TileLayer</div>,
  Marker: () => <div>Marker</div>,
  Popup: () => <div>Popup</div>,
  LayersControl: () => <div>LayersControl</div>,
}));

// Mock leaflet
jest.mock('leaflet', () => ({}));

test('renders BasicPlottedMap component', () => {
  render(<App />);
  const mapElement = screen.getByTestId('basic-plotted-map');
  expect(mapElement).toBeInTheDocument();
});

test('app renders without crashing', () => {
  render(<App />);
});
