// Simple map implementation using Canvas
class SimpleMap {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.isStreetView = true;
        this.zoom = 1;
        this.centerX = 0; // longitude offset
        this.centerY = 0; // latitude offset
        this.markers = [];
        this.nearbyMarkers = [];
        
        this.setupCanvas();
        this.setupEventListeners();
    }
    
    setupCanvas() {
        // Set canvas size
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
            this.draw();
        });
    }
    
    setupEventListeners() {
        // Click events for markers
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Check if click is on a marker
            for (let marker of this.markers) {
                const markerX = this.longitudeToX(marker.lng);
                const markerY = this.latitudeToY(marker.lat);
                
                if (Math.abs(x - markerX) < 15 && Math.abs(y - markerY) < 15) {
                    this.onMarkerClick(marker);
                    break;
                }
            }
        });
        
        // Mouse move for tooltips
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            let foundMarker = false;
            for (let marker of this.markers) {
                const markerX = this.longitudeToX(marker.lng);
                const markerY = this.latitudeToY(marker.lat);
                
                if (Math.abs(x - markerX) < 15 && Math.abs(y - markerY) < 15) {
                    this.showTooltip(e.clientX, e.clientY, marker.name);
                    this.canvas.style.cursor = 'pointer';
                    foundMarker = true;
                    break;
                }
            }
            
            if (!foundMarker) {
                this.hideTooltip();
                this.canvas.style.cursor = 'crosshair';
            }
        });
        
        // Mouse wheel for zoom
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
            this.zoom *= zoomFactor;
            this.zoom = Math.max(0.5, Math.min(5, this.zoom));
            this.draw();
        });
    }
    
    longitudeToX(lng) {
        return (this.canvas.width / 2) + ((lng + this.centerX) * this.canvas.width / 360 * this.zoom);
    }
    
    latitudeToY(lat) {
        return (this.canvas.height / 2) - ((lat + this.centerY) * this.canvas.height / 180 * this.zoom);
    }
    
    xToLongitude(x) {
        return ((x - this.canvas.width / 2) * 360) / (this.canvas.width * this.zoom) - this.centerX;
    }
    
    yToLatitude(y) {
        return -(((y - this.canvas.height / 2) * 180) / (this.canvas.height * this.zoom)) - this.centerY;
    }
    
    setView(lat, lng, zoom) {
        this.centerX = -lng;
        this.centerY = -lat;
        this.zoom = zoom;
        this.draw();
    }
    
    getCenter() {
        return {
            lat: -this.centerY,
            lng: -this.centerX
        };
    }
    
    addMarker(lat, lng, data) {
        const marker = { lat, lng, ...data };
        this.markers.push(marker);
        this.draw();
        return marker;
    }
    
    clearMarkers() {
        this.markers = [];
        this.nearbyMarkers = [];
        this.draw();
    }
    
    setMapType(isStreetView) {
        this.isStreetView = isStreetView;
        this.draw();
    }
    
    highlightNearbyMarkers(nearbyMarkers) {
        this.nearbyMarkers = nearbyMarkers;
        this.draw();
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background based on map type
        if (this.isStreetView) {
            // Street view - simple gradient
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
            gradient.addColorStop(0, '#87CEEB'); // Sky blue
            gradient.addColorStop(0.3, '#E0F6FF'); // Light blue
            gradient.addColorStop(0.7, '#90EE90'); // Light green
            gradient.addColorStop(1, '#228B22'); // Forest green
            this.ctx.fillStyle = gradient;
        } else {
            // Satellite view - darker gradient
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
            gradient.addColorStop(0, '#2C3E50'); // Dark blue
            gradient.addColorStop(0.3, '#34495E'); // Dark gray
            gradient.addColorStop(0.7, '#27AE60'); // Green
            gradient.addColorStop(1, '#16A085'); // Teal
            this.ctx.fillStyle = gradient;
        }
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid lines to simulate map
        this.drawGrid();
        
        // Draw markers
        this.drawMarkers();
    }
    
    drawGrid() {
        this.ctx.strokeStyle = this.isStreetView ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
        this.ctx.lineWidth = 1;
        
        // Vertical lines (longitude)
        for (let lng = -180; lng <= 180; lng += 30) {
            const x = this.longitudeToX(lng);
            if (x >= 0 && x <= this.canvas.width) {
                this.ctx.beginPath();
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.canvas.height);
                this.ctx.stroke();
            }
        }
        
        // Horizontal lines (latitude)
        for (let lat = -90; lat <= 90; lat += 30) {
            const y = this.latitudeToY(lat);
            if (y >= 0 && y <= this.canvas.height) {
                this.ctx.beginPath();
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(this.canvas.width, y);
                this.ctx.stroke();
            }
        }
    }
    
    drawMarkers() {
        // Draw regular markers
        this.markers.forEach(marker => {
            const x = this.longitudeToX(marker.lng);
            const y = this.latitudeToY(marker.lat);
            
            if (x >= -20 && x <= this.canvas.width + 20 && y >= -20 && y <= this.canvas.height + 20) {
                const isNearby = this.nearbyMarkers.some(nm => nm.id === marker.id);
                
                // Draw marker
                this.ctx.fillStyle = isNearby ? '#f39c12' : '#e74c3c';
                this.ctx.strokeStyle = 'white';
                this.ctx.lineWidth = 2;
                
                this.ctx.beginPath();
                this.ctx.arc(x, y, isNearby ? 12 : 10, 0, 2 * Math.PI);
                this.ctx.fill();
                this.ctx.stroke();
                
                // Draw pulse effect for nearby markers
                if (isNearby) {
                    this.ctx.strokeStyle = '#f39c12';
                    this.ctx.lineWidth = 2;
                    this.ctx.globalAlpha = 0.3;
                    this.ctx.beginPath();
                    this.ctx.arc(x, y, 20, 0, 2 * Math.PI);
                    this.ctx.stroke();
                    this.ctx.globalAlpha = 1;
                }
            }
        });
    }
    
    showTooltip(x, y, text) {
        let tooltip = document.getElementById('mapTooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'mapTooltip';
            tooltip.className = 'map-tooltip';
            document.body.appendChild(tooltip);
        }
        
        tooltip.textContent = text;
        tooltip.style.left = x + 'px';
        tooltip.style.top = (y - 30) + 'px';
        tooltip.style.display = 'block';
    }
    
    hideTooltip() {
        const tooltip = document.getElementById('mapTooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }
    
    onMarkerClick(marker) {
        // This will be set from outside
        if (this.markerClickHandler) {
            this.markerClickHandler(marker);
        }
    }
}

// Global variables
let map;
let allPoints = [];

// Initialize the application when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    loadMapPoints();
    setupEventListeners();
});

function initializeMap() {
    // Initialize the simple map
    map = new SimpleMap('mapCanvas');
    map.setView(40.7128, -74.0060, 1.5); // New York coordinates
    
    // Set marker click handler
    map.markerClickHandler = handleMarkerClick;
}

function setupEventListeners() {
    const nearbyBtn = document.getElementById('nearbyBtn');
    const streetViewBtn = document.getElementById('streetViewBtn');
    const satelliteViewBtn = document.getElementById('satelliteViewBtn');
    
    nearbyBtn.addEventListener('click', findNearbyPoints);
    
    streetViewBtn.addEventListener('click', () => {
        map.setMapType(true);
        streetViewBtn.classList.add('active');
        satelliteViewBtn.classList.remove('active');
    });
    
    satelliteViewBtn.addEventListener('click', () => {
        map.setMapType(false);
        satelliteViewBtn.classList.add('active');
        streetViewBtn.classList.remove('active');
    });
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
        
        // Clear existing markers
        map.clearMarkers();
        
        // Add markers for each point
        points.forEach(point => {
            map.addMarker(point.lat, point.lng, point);
        });
        
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
    const center = map.getCenter();
    const baseRadius = 2000; // km - larger radius for better demo
    
    updateStatus(`Finding points within ${baseRadius}km...`);
    
    const nearbyPoints = allPoints.filter(point => {
        const distance = calculateDistance(
            center.lat, center.lng,
            point.lat, point.lng
        );
        return distance <= baseRadius;
    });
    
    // Highlight nearby points
    map.highlightNearbyMarkers(nearbyPoints);
    
    updateStatus(`Found ${nearbyPoints.length} nearby points`);
    
    // Auto-clear nearby markers after 10 seconds
    setTimeout(() => {
        map.highlightNearbyMarkers([]);
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