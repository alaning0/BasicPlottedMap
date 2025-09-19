import React, { useState } from 'react';
import { BasicPlottedMap } from './components';
import { MapPoint } from './types';

// Example: Integration with state management and custom handlers
function ExampleApp() {
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [status, setStatus] = useState<string>('Ready');
  const [mapStyle, setMapStyle] = useState<'default' | 'compact'>('default');

  const handlePointSelect = (point: MapPoint) => {
    setSelectedPoint(point);
    console.log('Point selected in parent app:', point);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Example: Custom header with integration controls */}
      <div style={{ 
        padding: '1rem', 
        backgroundColor: '#34495e', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1>My Application with BasicPlottedMap</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div>
            <label style={{ marginRight: '0.5rem' }}>Map Style:</label>
            <select 
              value={mapStyle} 
              onChange={(e) => setMapStyle(e.target.value as 'default' | 'compact')}
              style={{ padding: '0.25rem' }}
            >
              <option value="default">Default</option>
              <option value="compact">Compact</option>
            </select>
          </div>
          <div>Status: {status}</div>
        </div>
      </div>

      {/* Example: Information panel showing integration data */}
      {selectedPoint && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#ecf0f1',
          borderBottom: '1px solid #bdc3c7'
        }}>
          <strong>Selected in Parent App:</strong> {selectedPoint.name} 
          ({selectedPoint.lat.toFixed(4)}, {selectedPoint.lng.toFixed(4)})
          <button 
            onClick={() => setSelectedPoint(null)}
            style={{ marginLeft: '1rem', padding: '0.25rem 0.5rem' }}
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* The integrated map component */}
      <div style={{ flex: 1 }}>
        <BasicPlottedMap
          className={mapStyle === 'compact' ? 'compact-map' : 'default-map'}
          onPointSelect={handlePointSelect}
          onStatusChange={handleStatusChange}
          defaultCenter={[40.7128, -74.0060]}
          defaultZoom={3}
        />
      </div>
    </div>
  );
}

export default ExampleApp;