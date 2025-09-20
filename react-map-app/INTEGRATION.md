# BasicPlottedMap React Component

A React component version of the BasicPlottedMap application that can be easily integrated into other React applications.

## Installation

If this were published as an npm package, you would install it with:

```bash
npm install basic-plotted-map-react
# or
yarn add basic-plotted-map-react
```

## Dependencies

This component requires the following peer dependencies:

```bash
npm install react react-dom leaflet react-leaflet @types/leaflet
```

## Basic Usage

```jsx
import React from 'react';
import { BasicPlottedMap } from 'basic-plotted-map-react';

function App() {
  const handlePointSelect = (point) => {
    console.log('Selected point:', point);
  };

  const handleStatusChange = (status) => {
    console.log('Status:', status);
  };

  return (
    <div style={{ height: '100vh' }}>
      <BasicPlottedMap
        onPointSelect={handlePointSelect}
        onStatusChange={handleStatusChange}
        defaultCenter={[40.7128, -74.0060]}
        defaultZoom={3}
      />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `''` | Additional CSS class for styling |
| `defaultCenter` | `[number, number]` | `[40.7128, -74.0060]` | Initial map center coordinates [lat, lng] |
| `defaultZoom` | `number` | `3` | Initial zoom level |
| `onPointSelect` | `(point: MapPoint) => void` | `undefined` | Callback fired when a point is selected |
| `onStatusChange` | `(status: string) => void` | `undefined` | Callback fired when status changes |

## Types

```typescript
interface MapPoint {
  id: number;
  name: string;
  lat: number;
  lng: number;
  type: string;
  description: string;
}

interface PointDetails {
  title: string;
  description: string;
  image?: string;
  data: PointDetailProperty[];
}

interface PointDetailProperty {
  property: string;
  value: string;
}
```

## Features

- ✅ Interactive Leaflet.js map with OpenStreetMap tiles
- ✅ Fallback mode when external resources are unavailable
- ✅ Point plotting with detailed information sidebar
- ✅ Nearby points search functionality
- ✅ Responsive design
- ✅ TypeScript support
- ✅ Customizable styling

## Advanced Usage

### Custom Styling

```jsx
import './my-custom-styles.css';

<BasicPlottedMap 
  className="my-custom-map"
  // ... other props
/>
```

### Integration with State Management

```jsx
import { useSelector, useDispatch } from 'react-redux';

function MapContainer() {
  const dispatch = useDispatch();
  const selectedPoint = useSelector(state => state.map.selectedPoint);

  const handlePointSelect = (point) => {
    dispatch(setSelectedPoint(point));
  };

  return (
    <BasicPlottedMap
      onPointSelect={handlePointSelect}
      // ... other props
    />
  );
}
```

### Using with React Router

```jsx
import { useNavigate } from 'react-router-dom';

function MapPage() {
  const navigate = useNavigate();

  const handlePointSelect = (point) => {
    navigate(`/point/${point.id}`);
  };

  return (
    <BasicPlottedMap onPointSelect={handlePointSelect} />
  );
}
```

## API Functions

You can also import and use the utility functions:

```jsx
import { fetchMapPoints, calculateDistance, findNearbyPoints } from 'basic-plotted-map-react';

// Fetch all map points
const points = await fetchMapPoints();

// Calculate distance between two points
const distance = calculateDistance(40.7128, -74.0060, 51.5074, -0.1278);

// Find nearby points
const nearby = findNearbyPoints(allPoints, centerPoint, 200);
```

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## License

MIT