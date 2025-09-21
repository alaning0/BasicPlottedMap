#!/usr/bin/env node
/**
 * Node.js HTTP server to serve the BasicPlottedMap application
 * Replaces the Python server.py with equivalent functionality
 */

const express = require('express');
const path = require('path');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

// Database path
const DB_PATH = path.join(__dirname, 'database', 'mapdata.db');

// Database connection
let db;

const app = express();
const PORT = process.env.PORT || 8000;

// Initialize database connection
function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
        reject(err);
        return;
      }
      console.log('Connected to SQLite database');
      resolve();
    });
  });
}

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
    db.all('SELECT * FROM map_points ORDER BY id', (err, rows) => {
        if (err) {
            console.error('Error fetching map points:', err.message);
            return res.status(500).json({ 
                error: 'Database error',
                message: 'Failed to fetch map points'
            });
        }
        res.json(rows);
    });
});

// API endpoint for point details
app.get('/api/points/:id', (req, res) => {
    const pointId = parseInt(req.params.id);
    
    // First, get the point details
    db.get('SELECT * FROM point_details WHERE point_id = ?', [pointId], (err, pointDetails) => {
        if (err) {
            console.error('Error fetching point details:', err.message);
            return res.status(500).json({ 
                error: 'Database error',
                message: 'Failed to fetch point details'
            });
        }
        
        if (!pointDetails) {
            return res.status(404).json({ 
                error: 'Point details not found',
                message: `No details available for point ID: ${pointId}`
            });
        }
        
        // Then, get the point detail data
        db.all('SELECT property, value FROM point_detail_data WHERE point_id = ? ORDER BY id', [pointId], (err, dataRows) => {
            if (err) {
                console.error('Error fetching point detail data:', err.message);
                return res.status(500).json({ 
                    error: 'Database error',
                    message: 'Failed to fetch point detail data'
                });
            }
            
            // Format the response to match the expected structure
            const response = {
                title: pointDetails.title,
                description: pointDetails.description,
                image: pointDetails.image,
                data: dataRows
            };
            
            res.json(response);
        });
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
async function startServer() {
    try {
        // Initialize database connection
        await initializeDatabase();
        
        // Start the HTTP server
        app.listen(PORT, () => {
            console.log(`🚀 BasicPlottedMap server running at http://localhost:${PORT}/`);
            console.log(`📊 Health check available at http://localhost:${PORT}/health`);
            console.log(`🗄️  Database: ${DB_PATH}`);
            console.log('Press Ctrl+C to stop the server');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
}

startServer();

// Graceful shutdown handling
process.on('SIGINT', () => {
    console.log('\n🛑 Server stopping...');
    if (db) {
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            } else {
                console.log('Database connection closed.');
            }
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Server stopping...');
    if (db) {
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            } else {
                console.log('Database connection closed.');
            }
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
});
