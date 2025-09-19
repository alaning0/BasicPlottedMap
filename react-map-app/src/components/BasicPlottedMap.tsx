import React, { useState, useEffect, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../BasicPlottedMap.css';

import { MapPoint, PointDetails, BasicPlottedMapProps } from '../types';
import { fetchMapPoints, fetchPointDetails, findNearbyPoints } from '../utils/api';
import Header from './Header';
import Sidebar from './Sidebar';
import MapView from './MapView';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const BasicPlottedMap: React.FC<BasicPlottedMapProps> = ({
  className = '',
  defaultCenter = [40.7128, -74.0060],
  defaultZoom = 3,
  onPointSelect,
  onStatusChange
}) => {
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [pointDetails, setPointDetails] = useState<PointDetails | null>(null);
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isLeafletAvailable, setIsLeafletAvailable] = useState<boolean>(true);

  // Update status and notify parent component
  const updateStatus = useCallback((newStatus: string) => {
    setStatus(newStatus);
    onStatusChange?.(newStatus);
  }, [onStatusChange]);

  // Load map points on component mount
  useEffect(() => {
    const loadPoints = async () => {
      setLoading(true);
      updateStatus('Loading map points...');
      
      try {
        const mapPoints = await fetchMapPoints();
        setPoints(mapPoints);
        updateStatus(`Loaded ${mapPoints.length} points`);
      } catch (error) {
        console.error('Error loading map points:', error);
        updateStatus('Error loading points');
      } finally {
        setLoading(false);
      }
    };

    loadPoints();
  }, [updateStatus]);

  // Handle point selection
  const handlePointSelect = useCallback(async (point: MapPoint) => {
    setSelectedPoint(point);
    onPointSelect?.(point);
    
    setLoading(true);
    updateStatus('Loading point details...');
    
    try {
      const details = await fetchPointDetails(point.id);
      setPointDetails(details);
      updateStatus('Point details loaded');
    } catch (error) {
      console.error('Error loading point details:', error);
      updateStatus('Error loading details');
      setPointDetails({
        title: 'Error',
        description: 'Failed to load point details',
        data: []
      });
    } finally {
      setLoading(false);
    }
  }, [onPointSelect, updateStatus]);

  // Handle nearby points search
  const handleFindNearbyPoints = useCallback(() => {
    if (!selectedPoint) {
      // If no point is selected, use Melbourne as the center for demonstration
      const melbournePoint = points.find(p => p.name === 'Melbourne');
      if (melbournePoint) {
        const nearbyPoints = findNearbyPoints(points, melbournePoint, 200);
        updateStatus(`Found ${nearbyPoints.length} nearby points`);
        
        // Display nearby points information
        setPointDetails({
          title: '🔍 Sample Nearby Points Search',
          description: `Search Center: ${melbournePoint.name} (${melbournePoint.lat.toFixed(4)}, ${melbournePoint.lng.toFixed(4)})`,
          data: [
            { property: 'Search Radius', value: '200km' },
            { property: 'Points Found', value: nearbyPoints.length.toString() }
          ]
        });
      } else {
        updateStatus('No center point available for nearby search');
      }
    } else {
      const nearbyPoints = findNearbyPoints(points, selectedPoint, 200);
      updateStatus(`Found ${nearbyPoints.length} nearby points`);
    }
  }, [selectedPoint, points, updateStatus]);

  // Check if Leaflet is available (for fallback mode)
  useEffect(() => {
    try {
      // Test if Leaflet is properly loaded
      if (typeof L !== 'undefined' && typeof L.map === 'function') {
        setIsLeafletAvailable(true);
      } else {
        setIsLeafletAvailable(false);
      }
    } catch (error) {
      console.warn('Leaflet.js not available, falling back to simple implementation');
      setIsLeafletAvailable(false);
    }
  }, []);

  return (
    <div className={`container ${className}`}>
      <Header 
        onFindNearbyPoints={handleFindNearbyPoints}
        status={status}
        loading={loading}
      />
      
      <main>
        <MapView
          points={points}
          onPointSelect={handlePointSelect}
          defaultCenter={defaultCenter}
          defaultZoom={defaultZoom}
          isLeafletAvailable={isLeafletAvailable}
        />
        
        <Sidebar
          pointDetails={pointDetails}
          loading={loading}
        />
      </main>
    </div>
  );
};

export default BasicPlottedMap;