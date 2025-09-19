// Type definitions for BasicPlottedMap React components

export interface MapPoint {
  id: number;
  name: string;
  lat: number;
  lng: number;
  type: string;
  description: string;
}

export interface PointDetails {
  title: string;
  description: string;
  image?: string;
  data: PointDetailProperty[];
}

export interface PointDetailProperty {
  property: string;
  value: string;
}

export interface NearbyPoint extends MapPoint {
  distance: number;
}

export interface MapCenter {
  name: string;
  lat: number;
  lng: number;
}

export interface BasicPlottedMapProps {
  className?: string;
  defaultCenter?: [number, number];
  defaultZoom?: number;
  onPointSelect?: (point: MapPoint) => void;
  onStatusChange?: (status: string) => void;
}