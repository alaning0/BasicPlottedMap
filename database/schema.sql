-- SQLite database schema for BasicPlottedMap
-- This file creates the necessary tables for map points and point details

-- Table for map points
CREATE TABLE IF NOT EXISTS map_points (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL
);

-- Table for point details
CREATE TABLE IF NOT EXISTS point_details (
    point_id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT,
    FOREIGN KEY (point_id) REFERENCES map_points (id) ON DELETE CASCADE
);

-- Table for point detail data (properties like population, area, etc.)
CREATE TABLE IF NOT EXISTS point_detail_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    point_id INTEGER NOT NULL,
    property TEXT NOT NULL,
    value TEXT NOT NULL,
    FOREIGN KEY (point_id) REFERENCES map_points (id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_map_points_type ON map_points(type);
CREATE INDEX IF NOT EXISTS idx_map_points_coords ON map_points(lat, lng);
CREATE INDEX IF NOT EXISTS idx_point_detail_data_point_id ON point_detail_data(point_id);
