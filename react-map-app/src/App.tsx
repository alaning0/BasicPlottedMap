import React from 'react';
import { BasicPlottedMap } from './components';
import { MapPoint } from './types';

function App() {
  const handlePointSelect = (point: MapPoint) => {
    console.log('Point selected:', point);
  };

  const handleStatusChange = (status: string) => {
    console.log('Status changed:', status);
  };

  return (
    <div className="App">
      <BasicPlottedMap
        onPointSelect={handlePointSelect}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

export default App;
