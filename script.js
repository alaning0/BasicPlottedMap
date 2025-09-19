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

// Mock API function to get points data
async function fetchMapPoints() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data with various global locations
    return [
        {
            id: 1,
            name: "New York City",
            lat: 40.7128,
            lng: -74.0060,
            type: "city",
            description: "The largest city in the United States"
        },
        {
            id: 2,
            name: "London",
            lat: 51.5074,
            lng: -0.1278,
            type: "city",
            description: "Capital of the United Kingdom"
        },
        {
            id: 3,
            name: "Tokyo",
            lat: 35.6762,
            lng: 139.6503,
            type: "city",
            description: "Capital of Japan"
        },
        {
            id: 4,
            name: "Sydney",
            lat: -33.8688,
            lng: 151.2093,
            type: "city",
            description: "Largest city in Australia"
        },
        {
            id: 5,
            name: "Paris",
            lat: 48.8566,
            lng: 2.3522,
            type: "city",
            description: "Capital of France"
        },
        {
            id: 6,
            name: "Cairo",
            lat: 30.0444,
            lng: 31.2357,
            type: "city",
            description: "Capital of Egypt"
        },
        {
            id: 7,
            name: "Mumbai",
            lat: 19.0760,
            lng: 72.8777,
            type: "city",
            description: "Financial capital of India"
        },
        {
            id: 8,
            name: "São Paulo",
            lat: -23.5505,
            lng: -46.6333,
            type: "city",
            description: "Largest city in Brazil"
        },
        {
            id: 9,
            name: "Cape Town",
            lat: -33.9249,
            lng: 18.4241,
            type: "city",
            description: "Legislative capital of South Africa"
        },
        {
            id: 10,
            name: "Vancouver",
            lat: 49.2827,
            lng: -123.1207,
            type: "city",
            description: "Coastal city in Canada"
        }
    ];
}

// Mock API function to get point details
async function fetchPointDetails(pointId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockDetails = {
        1: {
            title: "New York City Details",
            description: "The most populous city in the United States, located in the state of New York.",
            image: "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%234a90e2'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='20'%3ENew York%3C/text%3E%3C/svg%3E",
            data: [
                { property: "Population", value: "8.3 million" },
                { property: "Area", value: "778.2 km²" },
                { property: "Founded", value: "1624" },
                { property: "Time Zone", value: "EST (UTC-5)" }
            ]
        },
        2: {
            title: "London Details",
            description: "The capital and largest city of England and the United Kingdom.",
            image: "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%23e74c3c'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='20'%3ELondon%3C/text%3E%3C/svg%3E",
            data: [
                { property: "Population", value: "9.0 million" },
                { property: "Area", value: "1,572 km²" },
                { property: "Founded", value: "47 AD" },
                { property: "Time Zone", value: "GMT (UTC+0)" }
            ]
        },
        3: {
            title: "Tokyo Details",
            description: "The capital of Japan and the most populous metropolitan area in the world.",
            image: "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%23f39c12'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='20'%3ETokyo%3C/text%3E%3C/svg%3E",
            data: [
                { property: "Population", value: "37.4 million" },
                { property: "Area", value: "2,194 km²" },
                { property: "Founded", value: "1457" },
                { property: "Time Zone", value: "JST (UTC+9)" }
            ]
        },
        4: {
            title: "Sydney Details",
            description: "The largest city in Australia and a major global city known for its harbour.",
            image: "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%2327ae60'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='20'%3ESydney%3C/text%3E%3C/svg%3E",
            data: [
                { property: "Population", value: "5.3 million" },
                { property: "Area", value: "12,368 km²" },
                { property: "Founded", value: "1788" },
                { property: "Time Zone", value: "AEST (UTC+10)" }
            ]
        },
        5: {
            title: "Paris Details",
            description: "The capital and most populous city of France, known as the City of Light.",
            image: "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%239b59b6'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='20'%3EParis%3C/text%3E%3C/svg%3E",
            data: [
                { property: "Population", value: "2.1 million" },
                { property: "Area", value: "105.4 km²" },
                { property: "Founded", value: "3rd century BC" },
                { property: "Time Zone", value: "CET (UTC+1)" }
            ]
        },
        6: {
            title: "Cairo Details",
            description: "The capital of Egypt and the largest city in the Arab world.",
            image: "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%23d35400'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='20'%3ECairo%3C/text%3E%3C/svg%3E",
            data: [
                { property: "Population", value: "20.9 million" },
                { property: "Area", value: "606 km²" },
                { property: "Founded", value: "969 AD" },
                { property: "Time Zone", value: "EET (UTC+2)" }
            ]
        },
        7: {
            title: "Mumbai Details",
            description: "The financial capital of India and the most populous city in the country.",
            image: "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%2316a085'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='20'%3EMumbai%3C/text%3E%3C/svg%3E",
            data: [
                { property: "Population", value: "20.4 million" },
                { property: "Area", value: "603.4 km²" },
                { property: "Founded", value: "1507" },
                { property: "Time Zone", value: "IST (UTC+5:30)" }
            ]
        },
        8: {
            title: "São Paulo Details",
            description: "The largest city in Brazil and the most populous city in the Southern Hemisphere.",
            image: "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%232c3e50'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='20'%3ES%C3%A3o Paulo%3C/text%3E%3C/svg%3E",
            data: [
                { property: "Population", value: "12.3 million" },
                { property: "Area", value: "1,521 km²" },
                { property: "Founded", value: "1554" },
                { property: "Time Zone", value: "BRT (UTC-3)" }
            ]
        },
        9: {
            title: "Cape Town Details",
            description: "The legislative capital of South Africa and one of the most beautiful cities in the world.",
            image: "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%238e44ad'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='20'%3ECape Town%3C/text%3E%3C/svg%3E",
            data: [
                { property: "Population", value: "4.6 million" },
                { property: "Area", value: "2,454 km²" },
                { property: "Founded", value: "1652" },
                { property: "Time Zone", value: "SAST (UTC+2)" }
            ]
        },
        10: {
            title: "Vancouver Details",
            description: "A coastal city in western Canada, consistently ranked among the world's most livable cities.",
            image: "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%2334495e'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='20'%3EVancouver%3C/text%3E%3C/svg%3E",
            data: [
                { property: "Population", value: "2.6 million" },
                { property: "Area", value: "2,878 km²" },
                { property: "Founded", value: "1886" },
                { property: "Time Zone", value: "PST (UTC-8)" }
            ]
        }
    };
    
    return mockDetails[pointId] || {
        title: "Unknown Location",
        description: "No details available for this location.",
        image: "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%237f8c8d'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E",
        data: []
    };
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

function findNearbyPoints() {
    if (!isLeafletAvailable || !map) {
        updateStatus("Map not available for nearby search");
        return;
    }
    
    const center = map.getCenter();
    const zoomLevel = map.getZoom();
    
    // Calculate search radius based on zoom level (more zoomed in = smaller radius)
    const baseRadius = 1000; // km
    const radius = baseRadius / Math.pow(2, Math.max(0, zoomLevel - 3));
    
    updateStatus(`Finding points within ${Math.round(radius)}km...`);
    
    // Clear previous nearby markers
    nearbyMarkersLayer.clearLayers();
    
    const nearbyPoints = allPoints.filter(point => {
        const distance = calculateDistance(
            center.lat, center.lng,
            point.lat, point.lng
        );
        return distance <= radius;
    });
    
    // Highlight nearby points
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
    
    updateStatus(`Found ${nearbyPoints.length} nearby points`);
    
    // Auto-clear nearby markers after 10 seconds
    setTimeout(() => {
        nearbyMarkersLayer.clearLayers();
        updateStatus(`Loaded ${allPoints.length} points`);
    }, 10000);
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