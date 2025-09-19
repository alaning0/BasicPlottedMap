# BasicPlottedMap - GitHub Copilot Instructions

BasicPlottedMap is a vanilla JavaScript web application that displays an interactive map with plotted city points using Leaflet.js. The application features a simple Python development server and graceful fallback when external resources are unavailable.

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Bootstrap and Run the Application
Run these commands in sequence to set up and run the application:

```bash
# Navigate to repository root
cd /path/to/BasicPlottedMap

# Validate JavaScript syntax (takes < 5 seconds)
node -c script.js

# Start development server (takes < 2 seconds, runs indefinitely)
python3 server.py
# Server runs on http://localhost:8000
# Press Ctrl+C to stop
```

**NEVER CANCEL the development server** - it starts in under 2 seconds and runs indefinitely until manually stopped.

### Alternative: Direct Browser Access
The application can also run by opening `index.html` directly in a browser, but the Python server approach is recommended for development.

## Validation

### Required Validation Steps
Always run through these validation scenarios after making any changes:

1. **Start the application**: `python3 server.py` and access `http://localhost:8000`
2. **Test fallback mode**: Verify the application loads with "Map View" fallback when external CDN is blocked
3. **Test Find Nearby Points**: Click the "Find Nearby Points" button and verify status updates to "Found X nearby points"
4. **Verify no JavaScript errors**: Check browser console - should only show external CDN blocking, no syntax errors
5. **Test responsiveness**: Verify the sidebar and main map area display correctly

### CRITICAL Validation Requirements
- **Always validate JavaScript syntax** with `node -c script.js` before testing
- **Always test the complete user workflow** - don't just start and stop the application
- **Always check browser console** for JavaScript errors (CDN blocking is expected)

### Expected Behavior
- **Normal mode**: When Leaflet.js CDN is available, displays interactive OpenStreetMap
- **Fallback mode**: When external resources blocked, shows gradient background with "Map View" message
- **Find Nearby Points**: Shows status message "Found X nearby points" when clicked
- **No build step required**: Application runs directly with no compilation

## Common Issues and Solutions

### JavaScript Syntax Errors
- **Issue**: Functions using `await` must be declared as `async function`
- **Solution**: Ensure all functions using `await` have `async` declaration
- **Validation**: Run `node -c script.js` to check syntax

### External Dependencies
- **Leaflet.js CDN**: External CDN may be blocked in restricted environments
- **Expected**: Application gracefully falls back to simple implementation
- **Status**: Console shows "Leaflet.js not available, falling back to simple implementation"

### Development Server Issues  
- **Port conflict**: If port 8000 in use, stop existing server or use different port
- **Solution**: Modify `PORT = 8000` in `server.py` if needed
- **Fast startup**: Server typically starts in under 2 seconds

## File Structure and Key Locations

```
BasicPlottedMap/
├── .github/
│   ├── workflows/
│   │   └── deploy.yml          # GitHub Actions auto-deploy to GitHub Pages
│   └── copilot-instructions.md # This file
├── index.html                  # Main HTML structure and CDN imports
├── styles.css                  # Complete styling and responsive design  
├── script.js                   # Core application logic and mock APIs
├── server.py                   # Python development server with cache headers
└── README.md                   # User documentation
```

### Key Files to Check When Making Changes
- **script.js**: Contains all application logic, mock APIs, and async functions
- **styles.css**: Handles responsive layout and visual styling
- **index.html**: Defines structure and external CDN dependencies

## Technical Architecture

### Dependencies
- **Required**: Python 3.x (for development server)
- **Required**: Modern web browser with HTML5 support  
- **Optional**: Internet connection (for OpenStreetMap tiles)
- **External CDN**: Leaflet.js 1.9.4 (graceful fallback when unavailable)

### No Build Process
- **No npm install needed**: Pure vanilla JavaScript application
- **No compilation**: Runs directly from source files
- **No bundling**: Files served as-is by Python server
- **No testing framework**: Manual testing only

### Mock APIs and Data
- **fetchMapPoints()**: Returns 10 hardcoded global cities with coordinates
- **fetchPointDetails()**: Returns detailed city information with 300ms simulated delay
- **All async**: API functions use promises with realistic delays

## Deployment

The application automatically deploys to GitHub Pages via GitHub Actions when changes are pushed to the main branch. No manual deployment steps required.

## Timing Expectations

- **Python server startup**: < 2 seconds
- **JavaScript syntax validation**: < 5 seconds  
- **Application load**: < 1 second (fallback mode)
- **Find Nearby Points**: < 1 second (mock API response)

**NEVER CANCEL** any of these operations - they all complete quickly.

## Browser Compatibility

Confirmed working in environments that support:
- HTML5 and modern JavaScript (ES6+ async/await)
- CSS3 with flexbox and grid support
- Basic DOM manipulation and fetch APIs

## Cities and Data

The application includes 10 global cities with mock data:
New York City, London, Tokyo, Sydney, Paris, Cairo, Mumbai, São Paulo, Cape Town, Vancouver

Each city includes population, area, founding date, and time zone information accessed via mock APIs.