#!/usr/bin/env node
/**
 * Node.js HTTP server to serve the BasicPlottedMap application
 * Replaces the Python server.py with equivalent functionality
 */

const express = require('express');
const path = require('path');
const cors = require('cors');

// Mock data for map points and details (moved from React app)
const mockMapPoints = [
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
  },
  // Melbourne area points for testing nearby functionality
  {
    id: 11,
    name: "Melbourne",
    lat: -37.8136,
    lng: 144.9631,
    type: "city",
    description: "Cultural capital of Australia"
  },
  {
    id: 12,
    name: "Geelong",
    lat: -38.1499,
    lng: 144.3617,
    type: "city",
    description: "Port city 75km southwest of Melbourne"
  },
  {
    id: 13,
    name: "Ballarat",
    lat: -37.5622,
    lng: 143.8503,
    type: "city",
    description: "Historic gold rush city 105km northwest of Melbourne"
  },
  {
    id: 14,
    name: "Bendigo",
    lat: -36.7570,
    lng: 144.2794,
    type: "city",
    description: "Regional city 150km north of Melbourne"
  },
  {
    id: 15,
    name: "Mornington",
    lat: -38.2176,
    lng: 145.0391,
    type: "coastal",
    description: "Coastal town on Mornington Peninsula, 60km south of Melbourne"
  },
  {
    id: 16,
    name: "Dandenong Ranges",
    lat: -37.8341,
    lng: 145.3464,
    type: "natural",
    description: "Mountain range 40km east of Melbourne"
  },
  {
    id: 17,
    name: "Frankston",
    lat: -38.1402,
    lng: 145.1235,
    type: "coastal",
    description: "Coastal city 40km southeast of Melbourne"
  },
  {
    id: 18,
    name: "St Kilda",
    lat: -37.8681,
    lng: 144.9808,
    type: "beachside",
    description: "Beachside suburb 6km southeast of Melbourne CBD"
  }
];

const mockPointDetails = {
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
    description: "The legislative capital of South Africa and one of the country's three capital cities.",
    image: "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%23e67e22'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='20'%3ECape Town%3C/text%3E%3C/svg%3E",
    data: [
      { property: "Population", value: "4.6 million" },
      { property: "Area", value: "2,455 km²" },
      { property: "Founded", value: "1652" },
      { property: "Time Zone", value: "SAST (UTC+2)" }
    ]
  },
  10: {
    title: "Vancouver Details",
    description: "A major city in western Canada, located in British Columbia.",
    image: "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%231abc9c'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='20'%3EVancouver%3C/text%3E%3C/svg%3E",
    data: [
      { property: "Population", value: "2.6 million" },
      { property: "Area", value: "2,878 km²" },
      { property: "Founded", value: "1886" },
      { property: "Time Zone", value: "PST (UTC-8)" }
    ]
  },
  11: {
    title: "Melbourne Details",
    description: "The cultural capital of Australia and the second-most populous city in the country.",
    image: "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%238e44ad'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='20'%3EMelbourne%3C/text%3E%3C/svg%3E",
    data: [
      { property: "Population", value: "5.1 million" },
      { property: "Area", value: "9,993 km²" },
      { property: "Founded", value: "1835" },
      { property: "Time Zone", value: "AEST (UTC+10)" }
    ]
  }
};

const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS for all routes
app.use(cors());

// Set cache control headers to prevent caching (same as Python server)
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

// Serve static files from the current directory
app.use(express.static(path.join(__dirname), {
    // Disable caching for static files
    setHeaders: (res, path) => {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }
}));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'BasicPlottedMap server is running',
        timestamp: new Date().toISOString()
    });
});

// API endpoint for map points
app.get('/api/points', (req, res) => {
    res.json(mockMapPoints);
});

// API endpoint for point details
app.get('/api/points/:id', (req, res) => {
    const pointId = parseInt(req.params.id);
    const details = mockPointDetails[pointId];
    
    if (!details) {
        return res.status(404).json({ 
            error: 'Point details not found',
            message: `No details available for point ID: ${pointId}`
        });
    }
    
    res.json(details);
});

// Catch-all handler: serve index.html for any non-API routes
app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    // Serve index.html for all other routes (SPA behavior)
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 BasicPlottedMap server running at http://localhost:${PORT}/`);
    console.log(`📊 Health check available at http://localhost:${PORT}/health`);
    console.log('Press Ctrl+C to stop the server');
});

// Graceful shutdown handling
process.on('SIGINT', () => {
    console.log('\n🛑 Server stopped.');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Server stopped.');
    process.exit(0);
});
