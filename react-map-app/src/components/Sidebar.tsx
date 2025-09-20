import React from 'react';
import { PointDetails } from '../types';

interface SidebarProps {
  pointDetails: PointDetails | null;
  loading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ pointDetails, loading }) => {
  const renderPointDetails = () => {
    if (loading) {
      return <p>Loading...</p>;
    }

    if (!pointDetails) {
      return <p>Click on a point to view details</p>;
    }

    return (
      <div className="point-detail-item">
        <h4>{pointDetails.title}</h4>
        <p>{pointDetails.description}</p>
        {pointDetails.image && (
          <img 
            src={pointDetails.image} 
            alt={pointDetails.title} 
            className="detail-image"
          />
        )}
        {pointDetails.data && pointDetails.data.length > 0 && (
          <table className="detail-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {pointDetails.data.map((item, index) => (
                <tr key={index}>
                  <td>{item.property}</td>
                  <td>{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  return (
    <div id="sidebar" className="sidebar">
      <div className="sidebar-content">
        <h3>Point Details</h3>
        <div id="pointDetails">
          {renderPointDetails()}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;