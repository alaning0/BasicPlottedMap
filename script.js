// OpenStreetMap implementation using Leaflet.js
let map;
let markersLayer;
let nearbyMarkersLayer;
let allPoints = [];
let isLeafletAvailable = false;

// Initialize the application when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if Leaflet is available
    if (typeof L !== 'undefined') {
        isLeafletAvailable = true;
        initializeLeafletMap();
    } else {
        console.warn('Leaflet.js not available, falling back to simple implementation');
        initializeFallbackMap();
    }
    
    loadMapPoints();
    setupEventListeners();
});

function initializeLeafletMap() {
    // Initialize the map with OpenStreetMap tiles
    map = L.map('map').setView([40.7128, -74.0060], 3);

    // Create different tile layers
    const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    });

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 19
    });

    // Add the default layer (street)
    streetLayer.addTo(map);

    // Create layer control
    const baseLayers = {
        "Street View": streetLayer,
        "Satellite View": satelliteLayer
    };

    L.control.layers(baseLayers).addTo(map);

    // Initialize markers layers
    markersLayer = L.layerGroup().addTo(map);
    nearbyMarkersLayer = L.layerGroup().addTo(map);
}

function initializeFallbackMap() {
    // Fallback implementation when Leaflet is not available
    document.body.classList.add('leaflet-fallback');
    const mapDiv = document.getElementById('map');
    mapDiv.innerHTML = `
        <div style="position: relative; width: 100%; height: 100%; background: linear-gradient(180deg, #87CEEB 0%, #E0F6FF 30%, #90EE90 70%, #228B22 100%);">
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; color: #2c3e50;">
                <h3>Map View</h3>
                <p>OpenStreetMap tiles are not available in this environment</p>
                <p>Points will still be functional in the sidebar</p>
            </div>
        </div>
    `;
}

function setupEventListeners() {
    const nearbyBtn = document.getElementById('nearbyBtn');
    nearbyBtn.addEventListener('click', findNearbyPoints);
}

// API function to get points data from server
async function fetchMapPoints() {
    try {
        const response = await fetch('/api/points');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const points = await response.json();
        return points;
    } catch (error) {
        console.error('Error fetching map points:', error);
        // Return empty array on error to prevent breaking the app
        return [];
    }
}

// API function to get point details from server
async function fetchPointDetails(pointId) {
    try {
        const response = await fetch(`/api/points/${pointId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const details = await response.json();
        return details;
    } catch (error) {
        console.error(`Error fetching details for point ${pointId}:`, error);
        // Return default response on error
        return {
            title: "Error Loading Details",
            description: "Failed to load point details from server.",
            image: "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%237f8c8d'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='16'%3EError%3C/text%3E%3C/svg%3E",
            data: []
        };
    }
}

async function loadMapPoints() {
    updateStatus("Loading map points...");
    
    try {
        const points = await fetchMapPoints();
        allPoints = points;
        
        if (isLeafletAvailable && markersLayer) {
            // Clear existing markers
            markersLayer.clearLayers();
            
            // Add markers for each point
            points.forEach(point => {
                const marker = L.marker([point.lat, point.lng])
                    .bindPopup(`<strong>${point.name}</strong><br>${point.description}`)
                    .on('click', () => handleMarkerClick(point));
                
                markersLayer.addLayer(marker);
            });
            
            // Fit map to show all markers
            if (points.length > 0) {
                const group = new L.featureGroup(markersLayer.getLayers());
                map.fitBounds(group.getBounds().pad(0.1));
            }
        }
        
        updateStatus(`Loaded ${points.length} points`);
        
    } catch (error) {
        console.error('Error loading map points:', error);
        updateStatus("Error loading points");
    }
}

async function handleMarkerClick(point) {
    updateStatus("Loading point details...");
    
    try {
        const details = await fetchPointDetails(point.id);
        displayPointDetails(details);
        updateStatus("Point details loaded");
    } catch (error) {
        console.error('Error loading point details:', error);
        updateStatus("Error loading details");
        displayPointDetails({
            title: "Error",
            description: "Failed to load point details",
            image: "",
            data: []
        });
    }
}

function displayPointDetails(details) {
    const detailsContainer = document.getElementById('pointDetails');
    
    let tableHtml = '';
    if (details.data && details.data.length > 0) {
        tableHtml = `
            <table class="detail-table">
                <thead>
                    <tr>
                        <th>Property</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    ${details.data.map(item => `
                        <tr>
                            <td>${item.property}</td>
                            <td>${item.value}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    
    detailsContainer.innerHTML = `
        <div class="point-detail-item">
            <h4>${details.title}</h4>
            <p>${details.description}</p>
            ${details.image ? `<img src="${details.image}" alt="${details.title}" class="detail-image">` : ''}
            ${tableHtml}
        </div>
    `;
}

async function displayNearbyPointsDetails(nearbyPoints, center) {
    const detailsContainer = document.getElementById('pointDetails');
    
    if (nearbyPoints.length === 0) {
        detailsContainer.innerHTML = '<p>No nearby points found in the search area.</p>';
        return;
    }
    
    // Update sidebar title
    const sidebarTitle = document.querySelector('.sidebar h3');
    sidebarTitle.textContent = `Nearby Points (${nearbyPoints.length})`;
    
    // Show loading message while fetching details
    detailsContainer.innerHTML = '<p>Loading nearby points details...</p>';
    
    // Create HTML for all nearby points
    let nearbyHtml = '';
    
    for (const point of nearbyPoints) {
        const distance = Math.round(calculateDistance(center.lat, center.lng, point.lat, point.lng));
        
        try {
            // Fetch detailed information for each point
            const details = await fetchPointDetails(point.id);
            
            let tableHtml = '';
            if (details.data && details.data.length > 0) {
                tableHtml = `
                    <table class="detail-table">
                        <thead>
                            <tr>
                                <th>Property</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${details.data.map(item => `
                                <tr>
                                    <td>${item.property}</td>
                                    <td>${item.value}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            }
            
            nearbyHtml += `
                <div class="point-detail-item nearby-point-item">
                    <div class="nearby-point-header">
                        <h4>${point.name}</h4>
                        <span class="distance-badge">${distance}km away</span>
                    </div>
                    <p>${details.description}</p>
                    ${details.image ? `<img src="${details.image}" alt="${details.title}" class="detail-image">` : ''}
                    ${tableHtml}
                </div>
            `;
        } catch (error) {
            console.error(`Error loading details for ${point.name}:`, error);
            nearbyHtml += `
                <div class="point-detail-item nearby-point-item">
                    <div class="nearby-point-header">
                        <h4>${point.name}</h4>
                        <span class="distance-badge">${distance}km away</span>
                    </div>
                    <p>${point.description}</p>
                </div>
            `;
        }
    }
    
    detailsContainer.innerHTML = nearbyHtml;
    
    // Reset sidebar title after 10 seconds (to match map marker clear timing)
    setTimeout(() => {
        const sidebarTitle = document.querySelector('.sidebar h3');
        sidebarTitle.textContent = 'Point Details';
        detailsContainer.innerHTML = '<p>Click on a point to view details</p>';
    }, 10000);
}

function findNearbyPoints() {
    let center, radius;
    
    if (isLeafletAvailable && map) {
        // Use actual map center and zoom-based radius when map is available
        center = map.getCenter();
        const zoomLevel = map.getZoom();
        const baseRadius = 1000; // km
        radius = baseRadius / Math.pow(2, Math.max(0, zoomLevel - 3));
    } else {
        // Use sample center point and fixed radius for demo in fallback mode
        center = { lat: -37.8136, lng: 144.9631 }; // Melbourne as demo center
        radius = 2000; // 2000km radius for demo to show Melbourne area points
        updateStatus("Demo mode: Finding points within 2000km of Melbourne...");
    }
    
    if (isLeafletAvailable && map) {
        updateStatus(`Finding points within ${Math.round(radius)}km...`);
        // Clear previous nearby markers
        nearbyMarkersLayer.clearLayers();
    }
    
    const nearbyPoints = allPoints.filter(point => {
        const distance = calculateDistance(
            center.lat, center.lng,
            point.lat, point.lng
        );
        return distance <= radius;
    });
    
    // Sort by distance for better user experience
    nearbyPoints.sort((a, b) => {
        const distanceA = calculateDistance(center.lat, center.lng, a.lat, a.lng);
        const distanceB = calculateDistance(center.lat, center.lng, b.lat, b.lng);
        return distanceA - distanceB;
    });
    
    if (isLeafletAvailable && map) {
        // Highlight nearby points on map
        nearbyPoints.forEach(point => {
            const nearbyMarker = L.circleMarker([point.lat, point.lng], {
                radius: 15,
                fillColor: '#ff7800',
                color: '#ff7800',
                weight: 3,
                opacity: 0.7,
                fillOpacity: 0.3
            }).bindPopup(`<strong>Nearby: ${point.name}</strong><br>Distance: ${Math.round(calculateDistance(center.lat, center.lng, point.lat, point.lng))}km`);
            
            nearbyMarkersLayer.addLayer(nearbyMarker);
        });
        
        // Auto-clear nearby markers after 10 seconds
        setTimeout(() => {
            nearbyMarkersLayer.clearLayers();
            updateStatus(`Loaded ${allPoints.length} points`);
        }, 10000);
    }
    
    // Display nearby points information in sidebar
    displayNearbyPointsDetails(nearbyPoints, center);
    
    updateStatus(`Found ${nearbyPoints.length} nearby points`);
}

function showSampleNearbyPoints() {
    updateStatus("Showing sample nearby points data...");
    
    // Sample scenario: searching from London (51.5074, -0.1278) with 3000km radius
    const sampleCenter = { lat: 51.5074, lng: -0.1278, name: "London" };
    const sampleRadius = 3000; // km
    
    // Calculate which cities are within the sample radius
    const nearbyPoints = allPoints.filter(point => {
        const distance = calculateDistance(
            sampleCenter.lat, sampleCenter.lng,
            point.lat, point.lng
        );
        return distance <= sampleRadius;
    }).map(point => {
        const distance = calculateDistance(
            sampleCenter.lat, sampleCenter.lng,
            point.lat, point.lng
        );
        return { ...point, distance: Math.round(distance) };
    }).sort((a, b) => a.distance - b.distance);
    
    // Display sample data in the sidebar
    displaySampleNearbyData(sampleCenter, sampleRadius, nearbyPoints);
    
    updateStatus(`Sample: Found ${nearbyPoints.length} points within ${sampleRadius}km of ${sampleCenter.name}`);
    
    // Auto-clear after 15 seconds to show it's a demo
    setTimeout(() => {
        document.getElementById('pointDetails').innerHTML = '<p>Click on a point to view details</p>';
        updateStatus("Sample data cleared - click a point for details");
    }, 15000);
}

function displaySampleNearbyData(center, radius, nearbyPoints) {
    const detailsContainer = document.getElementById('pointDetails');
    
    let pointsHtml = '';
    if (nearbyPoints.length > 0) {
        pointsHtml = `
            <div class="sample-points-list">
                ${nearbyPoints.map(point => `
                    <div class="sample-point-item" onclick="handleSamplePointClick(${point.id})">
                        <div class="sample-point-header">
                            <strong>${point.name}</strong>
                            <span class="sample-distance">${point.distance}km</span>
                        </div>
                        <div class="sample-point-description">${point.description}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    detailsContainer.innerHTML = `
        <div class="point-detail-item">
            <h4>🔍 Sample Nearby Points Search</h4>
            <p><strong>Search Center:</strong> ${center.name} (${center.lat.toFixed(4)}, ${center.lng.toFixed(4)})</p>
            <p><strong>Search Radius:</strong> ${radius}km</p>
            <p><strong>Results:</strong> ${nearbyPoints.length} points found</p>
            ${pointsHtml}
            <div class="sample-note">
                <em>💡 This is sample data showing how the nearby search works. In normal mode, the search uses your current map view center.</em>
            </div>
        </div>
    `;
}

async function handleSamplePointClick(pointId) {
    updateStatus("Loading sample point details...");
    try {
        const details = await fetchPointDetails(pointId);
        displayPointDetails(details);
        updateStatus("Sample point details loaded");
    } catch (error) {
        console.error('Error loading sample point details:', error);
        updateStatus("Error loading sample details");
    }

}

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
}

function updateStatus(message) {
    const statusElement = document.getElementById('status');
    statusElement.textContent = message;
    
    // Clear status after 3 seconds
    setTimeout(() => {
        if (statusElement.textContent === message) {
            statusElement.textContent = '';
        }
    }, 3000);
}