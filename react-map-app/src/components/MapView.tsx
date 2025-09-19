import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import { MapPoint } from '../types';

interface MapViewProps {
  points: MapPoint[];
  onPointSelect: (point: MapPoint) => void;
  defaultCenter: [number, number];
  defaultZoom: number;
  isLeafletAvailable: boolean;
}

const MapView: React.FC<MapViewProps> = ({
  points,
  onPointSelect,
  defaultCenter,
  defaultZoom,
  isLeafletAvailable
}) => {
  const mapRef = useRef<L.Map | null>(null);

  // Fallback component when Leaflet is not available
  const FallbackMap: React.FC = () => (
    <div 
      id="map"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(180deg, #87CEEB 0%, #E0F6FF 30%, #90EE90 70%, #228B22 100%)'
      }}
    >
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: '#2c3e50'
        }}
      >
        <h3>Map View</h3>
        <p>OpenStreetMap tiles are not available in this environment</p>
        <p>Points will still be functional in the sidebar</p>
      </div>
    </div>
  );

  // Handle marker click
  const handleMarkerClick = (point: MapPoint) => {
    onPointSelect(point);
  };

  // Fit map bounds to show all markers when points change
  useEffect(() => {
    if (mapRef.current && points.length > 0) {
      const bounds = L.latLngBounds(points.map(point => [point.lat, point.lng]));
      mapRef.current.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [points]);

  if (!isLeafletAvailable) {
    return <FallbackMap />;
  }

  return (
    <div id="map" style={{ height: '100%', width: '100%' }}>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Street View">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer name="Satellite View">
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {points.map((point) => (
          <Marker
            key={point.id}
            position={[point.lat, point.lng]}
            eventHandlers={{
              click: () => handleMarkerClick(point),
            }}
          >
            <Popup>
              <strong>{point.name}</strong>
              <br />
              {point.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;