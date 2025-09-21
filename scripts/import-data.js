#!/usr/bin/env node
/**
 * Import script to populate SQLite database with mock data
 * Run with: node scripts/import-data.js
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database path
const DB_PATH = path.join(__dirname, '..', 'database', 'mapdata.db');

// Mock data (extracted from server.js)
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

// Function to create database and tables
function createDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
        reject(err);
        return;
      }
      console.log('Connected to SQLite database');
    });

    // Read and execute schema
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    db.exec(schema, (err) => {
      if (err) {
        console.error('Error creating tables:', err.message);
        reject(err);
        return;
      }
      console.log('Database tables created successfully');
      resolve(db);
    });
  });
}

// Function to insert map points
function insertMapPoints(db) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO map_points (id, name, lat, lng, type, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    let completed = 0;
    const total = mockMapPoints.length;

    mockMapPoints.forEach((point) => {
      stmt.run([point.id, point.name, point.lat, point.lng, point.type, point.description], (err) => {
        if (err) {
          console.error('Error inserting map point:', err.message);
          reject(err);
          return;
        }
        completed++;
        if (completed === total) {
          stmt.finalize();
          console.log(`Inserted ${total} map points`);
          resolve();
        }
      });
    });
  });
}

// Function to insert point details
function insertPointDetails(db) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO point_details (point_id, title, description, image)
      VALUES (?, ?, ?, ?)
    `);

    const pointIds = Object.keys(mockPointDetails);
    let completed = 0;
    const total = pointIds.length;

    pointIds.forEach((pointId) => {
      const details = mockPointDetails[pointId];
      stmt.run([parseInt(pointId), details.title, details.description, details.image], (err) => {
        if (err) {
          console.error('Error inserting point details:', err.message);
          reject(err);
          return;
        }
        completed++;
        if (completed === total) {
          stmt.finalize();
          console.log(`Inserted ${total} point details`);
          resolve();
        }
      });
    });
  });
}

// Function to insert point detail data
function insertPointDetailData(db) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO point_detail_data (point_id, property, value)
      VALUES (?, ?, ?)
    `);

    let totalInserts = 0;
    let completed = 0;

    // Count total inserts needed
    Object.keys(mockPointDetails).forEach((pointId) => {
      totalInserts += mockPointDetails[pointId].data.length;
    });

    if (totalInserts === 0) {
      resolve();
      return;
    }

    Object.keys(mockPointDetails).forEach((pointId) => {
      const details = mockPointDetails[pointId];
      details.data.forEach((dataItem) => {
        stmt.run([parseInt(pointId), dataItem.property, dataItem.value], (err) => {
          if (err) {
            console.error('Error inserting point detail data:', err.message);
            reject(err);
            return;
          }
          completed++;
          if (completed === totalInserts) {
            stmt.finalize();
            console.log(`Inserted ${totalInserts} point detail data items`);
            resolve();
          }
        });
      });
    });
  });
}

// Main function
async function main() {
  try {
    console.log('Starting data import...');
    
    // Create database directory if it doesn't exist
    const dbDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Create database and tables
    const db = await createDatabase();

    // Insert data
    await insertMapPoints(db);
    await insertPointDetails(db);
    await insertPointDetailData(db);

    // Close database
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed');
        console.log('✅ Data import completed successfully!');
        console.log(`Database created at: ${DB_PATH}`);
      }
    });

  } catch (error) {
    console.error('❌ Error during import:', error.message);
    process.exit(1);
  }
}

// Run the import
if (require.main === module) {
  main();
}

module.exports = { main };
