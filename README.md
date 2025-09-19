# BasicPlottedMap

A web-based map viewing application that displays interactive maps with plotted points, built with vanilla JavaScript and HTML5 Canvas.

## Features

### 🗺️ Interactive Map Display
- **Street View**: Light gradient background with grid overlay
- **Satellite View**: Dark gradient background simulating satellite imagery
- **Canvas-based rendering**: Smooth, responsive map interface
- **Mouse wheel zoom**: Zoom in/out functionality
- **Grid lines**: Visual reference grid showing longitude/latitude

### 📍 Point Plotting & Interaction
- **Global city markers**: 10 major cities plotted worldwide
- **Click to view details**: Interactive markers showing detailed information
- **Hover tooltips**: City names displayed on mouse hover
- **Mock API simulation**: Realistic API delay simulation for data fetching

### 📊 Detailed Point Information
- **Rich data display**: Each point shows comprehensive information
- **HTML table format**: Structured data including population, area, founding date, time zone
- **Sample images**: SVG placeholder images for each location
- **Responsive sidebar**: Clean, organized information panel

### 🔍 Nearby Points Feature
- **Proximity search**: Find points within a specified radius
- **Visual highlighting**: Nearby points highlighted in orange with pulse animation
- **Distance calculation**: Uses Haversine formula for accurate geo-distance
- **Auto-clear**: Highlighting automatically clears after 10 seconds

### 🎨 User Interface
- **Modern design**: Clean, professional interface
- **Responsive layout**: Works on desktop and mobile devices
- **Status feedback**: Real-time status updates for user actions
- **Smooth animations**: Hover effects and transitions

## Technical Implementation

### Architecture
- **Frontend**: Pure HTML5, CSS3, and vanilla JavaScript
- **Map Rendering**: HTML5 Canvas for performance and flexibility
- **Mock APIs**: Simulated backend with realistic data and delays
- **No external dependencies**: Self-contained application

### Data Sources
- **Mock location API**: Returns 10 global cities with coordinates
- **Mock details API**: Provides detailed information for each city
- **SVG placeholder images**: Embedded data URIs for offline functionality

## Getting Started

### Prerequisites
- Modern web browser with HTML5 Canvas support
- Python 3.x (for local server)

### Installation & Running

1. **Clone the repository**
   ```bash
   git clone https://github.com/AlanIngCin8/BasicPlottedMap.git
   cd BasicPlottedMap
   ```

2. **Start the local server**
   ```bash
   python3 server.py
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### File Structure
```
BasicPlottedMap/
├── index.html          # Main HTML structure
├── styles.css          # Styling and responsive design
├── script.js           # Core application logic and map implementation
├── server.py           # Simple HTTP server for local development
└── README.md           # This file
```

## Usage

### Basic Navigation
1. **View the map**: Points are automatically loaded and displayed
2. **Switch views**: Click "Street View" or "Satellite View" buttons
3. **Zoom**: Use mouse wheel to zoom in/out
4. **Hover**: Move mouse over markers to see city names

### Interacting with Points
1. **Click markers**: Click any red marker to view detailed information
2. **View details**: Information appears in the right sidebar including:
   - City description
   - Statistical data table
   - Representative image

### Finding Nearby Points
1. **Click "Find Nearby Points"**: Searches within 2000km radius of current map center
2. **View results**: Nearby points highlighted in orange with pulse animation
3. **Automatic reset**: Highlighting clears after 10 seconds

## Cities Included

The application includes 10 major global cities:
- 🇺🇸 New York City
- 🇬🇧 London
- 🇯🇵 Tokyo
- 🇦🇺 Sydney
- 🇫🇷 Paris
- 🇪🇬 Cairo
- 🇮🇳 Mumbai
- 🇧🇷 São Paulo
- 🇿🇦 Cape Town
- 🇨🇦 Vancouver

## Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+

## Future Enhancements

- Real map tile integration (OpenStreetMap)
- GPS location support
- Custom marker addition
- Export/import functionality
- Advanced filtering options
- Real-time data integration

## License

This project is open source and available under the MIT License.