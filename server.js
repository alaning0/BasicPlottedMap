#!/usr/bin/env node
/**
 * Node.js HTTP server to serve the BasicPlottedMap application
 * Replaces the Python server.py with equivalent functionality
 */

const express = require('express');
const path = require('path');
const cors = require('cors');

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

// API endpoint for map points (if needed for future expansion)
app.get('/api/points', (req, res) => {
    // This could be expanded to serve dynamic data in the future
    res.json({ 
        message: 'Map points are currently served via client-side mock data',
        note: 'See script.js for current implementation'
    });
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
