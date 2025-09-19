import React from 'react';

interface HeaderProps {
  onFindNearbyPoints: () => void;
  status: string;
  loading: boolean;
}

const Header: React.FC<HeaderProps> = ({ onFindNearbyPoints, status, loading }) => {
  return (
    <header>
      <h1>Basic Plotted Map</h1>
      <div className="controls">
        <button 
          id="nearbyBtn" 
          className="btn"
          onClick={onFindNearbyPoints}
          disabled={loading}
        >
          Find Nearby Points
        </button>
        <span id="status">{status}</span>
      </div>
    </header>
  );
};

export default Header;