#!/usr/bin/env python3
"""
Simple HTTP server to serve the BasicPlottedMap application
"""
import http.server
import socketserver
import os
import sys
import json
import urllib.parse

PORT = 8000

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    
    def do_GET(self):
        # Parse the URL
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        # Handle API routes
        if path.startswith('/api/'):
            self.handle_api_request(path)
        else:
            # Handle static files
            super().do_GET()
    
    def handle_api_request(self, path):
        """Handle API requests"""
        try:
            if path == '/api/points':
                self.serve_points()
            elif path.startswith('/api/points/'):
                # Extract point ID from path
                point_id = path.split('/')[-1]
                self.serve_point_details(point_id)
            else:
                self.send_error(404, "API endpoint not found")
        except Exception as e:
            self.send_error(500, f"Internal server error: {str(e)}")
    
    def serve_points(self):
        """Serve the list of map points"""
        points_data = [
            {
                "id": 1,
                "name": "New York City",
                "lat": 40.7128,
                "lng": -74.0060,
                "type": "city",
                "description": "The largest city in the United States"
            },
            {
                "id": 2,
                "name": "London",
                "lat": 51.5074,
                "lng": -0.1278,
                "type": "city",
                "description": "Capital of the United Kingdom"
            },
            {
                "id": 3,
                "name": "Tokyo",
                "lat": 35.6762,
                "lng": 139.6503,
                "type": "city",
                "description": "Capital of Japan"
            },
            {
                "id": 4,
                "name": "Sydney",
                "lat": -33.8688,
                "lng": 151.2093,
                "type": "city",
                "description": "Largest city in Australia"
            },
            {
                "id": 5,
                "name": "Paris",
                "lat": 48.8566,
                "lng": 2.3522,
                "type": "city",
                "description": "Capital of France"
            },
            {
                "id": 6,
                "name": "Cairo",
                "lat": 30.0444,
                "lng": 31.2357,
                "type": "city",
                "description": "Capital of Egypt"
            },
            {
                "id": 7,
                "name": "Mumbai",
                "lat": 19.0760,
                "lng": 72.8777,
                "type": "city",
                "description": "Financial capital of India"
            },
            {
                "id": 8,
                "name": "São Paulo",
                "lat": -23.5505,
                "lng": -46.6333,
                "type": "city",
                "description": "Largest city in Brazil"
            },
            {
                "id": 9,
                "name": "Cape Town",
                "lat": -33.9249,
                "lng": 18.4241,
                "type": "city",
                "description": "Legislative capital of South Africa"
            },
            {
                "id": 10,
                "name": "Vancouver",
                "lat": 49.2827,
                "lng": -123.1207,
                "type": "city",
                "description": "Coastal city in Canada"
            },
            # Melbourne area points for testing nearby functionality
            {
                "id": 11,
                "name": "Melbourne",
                "lat": -37.8136,
                "lng": 144.9631,
                "type": "city",
                "description": "Cultural capital of Australia"
            },
            {
                "id": 12,
                "name": "Geelong",
                "lat": -38.1499,
                "lng": 144.3617,
                "type": "city",
                "description": "Port city 75km southwest of Melbourne"
            },
            {
                "id": 13,
                "name": "Ballarat",
                "lat": -37.5622,
                "lng": 143.8503,
                "type": "city",
                "description": "Historic gold rush city 105km northwest of Melbourne"
            },
            {
                "id": 14,
                "name": "Bendigo",
                "lat": -36.7570,
                "lng": 144.2794,
                "type": "city",
                "description": "Regional city 150km north of Melbourne"
            },
            {
                "id": 15,
                "name": "Mornington",
                "lat": -38.2176,
                "lng": 145.0391,
                "type": "coastal",
                "description": "Coastal town on Mornington Peninsula, 60km south of Melbourne"
            },
            {
                "id": 16,
                "name": "Dandenong Ranges",
                "lat": -37.8339,
                "lng": 145.3464,
                "type": "landmark",
                "description": "Mountain range and national park 40km east of Melbourne"
            },
            {
                "id": 17,
                "name": "Frankston",
                "lat": -38.1342,
                "lng": 145.1231,
                "type": "suburb",
                "description": "Bayside suburb 40km southeast of Melbourne"
            },
            {
                "id": 18,
                "name": "St Kilda",
                "lat": -37.8677,
                "lng": 144.9811,
                "type": "suburb",
                "description": "Famous beachside suburb 8km south of Melbourne CBD"
            },
            {
                "id": 19,
                "name": "Richmond",
                "lat": -37.8197,
                "lng": 144.9934,
                "type": "suburb",
                "description": "Inner-city suburb 5km east of Melbourne CBD"
            },
            {
                "id": 20,
                "name": "Footscray",
                "lat": -37.7993,
                "lng": 144.9005,
                "type": "suburb",
                "description": "Multicultural suburb 8km west of Melbourne CBD"
            }
        ]
        
        self.send_json_response(points_data)
    
    def serve_point_details(self, point_id):
        """Serve detailed information for a specific point"""
        try:
            point_id = int(point_id)
        except ValueError:
            self.send_error(400, "Invalid point ID")
            return
        
        point_details = {
            1: {
                "title": "New York City Details",
                "description": "The most populous city in the United States, located in the state of New York.",
                "image": "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%234a90e2'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='20'%3ENew York%3C/text%3E%3C/svg%3E",
                "data": [
                    {"property": "Population", "value": "8.3 million"},
                    {"property": "Area", "value": "778.2 km²"},
                    {"property": "Founded", "value": "1624"},
                    {"property": "Time Zone", "value": "EST (UTC-5)"}
                ]
            },
            2: {
                "title": "London Details",
                "description": "The capital and largest city of England and the United Kingdom.",
                "image": "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%23e74c3c'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='20'%3ELondon%3C/text%3E%3C/svg%3E",
                "data": [
                    {"property": "Population", "value": "9.0 million"},
                    {"property": "Area", "value": "1,572 km²"},
                    {"property": "Founded", "value": "47 AD"},
                    {"property": "Time Zone", "value": "GMT (UTC+0)"}
                ]
            },
            3: {
                "title": "Tokyo Details",
                "description": "The capital of Japan and the most populous metropolitan area in the world.",
                "image": "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%23f39c12'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='20'%3ETokyo%3C/text%3E%3C/svg%3E",
                "data": [
                    {"property": "Population", "value": "37.4 million"},
                    {"property": "Area", "value": "2,194 km²"},
                    {"property": "Founded", "value": "1457"},
                    {"property": "Time Zone", "value": "JST (UTC+9)"}
                ]
            },
            4: {
                "title": "Sydney Details",
                "description": "The largest city in Australia and a major global city known for its harbour.",
                "image": "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%2327ae60'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='20'%3ESydney%3C/text%3E%3C/svg%3E",
                "data": [
                    {"property": "Population", "value": "5.3 million"},
                    {"property": "Area", "value": "12,368 km²"},
                    {"property": "Founded", "value": "1788"},
                    {"property": "Time Zone", "value": "AEST (UTC+10)"}
                ]
            },
            5: {
                "title": "Paris Details",
                "description": "The capital and most populous city of France, known as the City of Light.",
                "image": "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%239b59b6'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='20'%3EParis%3C/text%3E%3C/svg%3E",
                "data": [
                    {"property": "Population", "value": "2.1 million"},
                    {"property": "Area", "value": "105.4 km²"},
                    {"property": "Founded", "value": "3rd century BC"},
                    {"property": "Time Zone", "value": "CET (UTC+1)"}
                ]
            },
            6: {
                "title": "Cairo Details",
                "description": "The capital of Egypt and the largest city in the Arab world.",
                "image": "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%23d35400'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='20'%3ECairo%3C/text%3E%3C/svg%3E",
                "data": [
                    {"property": "Population", "value": "20.9 million"},
                    {"property": "Area", "value": "606 km²"},
                    {"property": "Founded", "value": "969 AD"},
                    {"property": "Time Zone", "value": "EET (UTC+2)"}
                ]
            },
            7: {
                "title": "Mumbai Details",
                "description": "The financial capital of India and the most populous city in the country.",
                "image": "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%2316a085'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='20'%3EMumbai%3C/text%3E%3C/svg%3E",
                "data": [
                    {"property": "Population", "value": "20.4 million"},
                    {"property": "Area", "value": "603.4 km²"},
                    {"property": "Founded", "value": "1507"},
                    {"property": "Time Zone", "value": "IST (UTC+5:30)"}
                ]
            },
            8: {
                "title": "São Paulo Details",
                "description": "The largest city in Brazil and the most populous city in the Southern Hemisphere.",
                "image": "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%232c3e50'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='20'%3ES%C3%A3o Paulo%3C/text%3E%3C/svg%3E",
                "data": [
                    {"property": "Population", "value": "12.3 million"},
                    {"property": "Area", "value": "1,521 km²"},
                    {"property": "Founded", "value": "1554"},
                    {"property": "Time Zone", "value": "BRT (UTC-3)"}
                ]
            },
            9: {
                "title": "Cape Town Details",
                "description": "The legislative capital of South Africa and one of the most beautiful cities in the world.",
                "image": "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%238e44ad'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='20'%3ECape Town%3C/text%3E%3C/svg%3E",
                "data": [
                    {"property": "Population", "value": "4.6 million"},
                    {"property": "Area", "value": "2,454 km²"},
                    {"property": "Founded", "value": "1652"},
                    {"property": "Time Zone", "value": "SAST (UTC+2)"}
                ]
            },
            10: {
                "title": "Vancouver Details",
                "description": "A coastal city in western Canada, consistently ranked among the world's most livable cities.",
                "image": "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%2334495e'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='20'%3EVancouver%3C/text%3E%3C/svg%3E",
                "data": [
                    {"property": "Population", "value": "2.6 million"},
                    {"property": "Area", "value": "2,878 km²"},
                    {"property": "Founded", "value": "1886"},
                    {"property": "Time Zone", "value": "PST (UTC-8)"}
                ]
            },
            # Melbourne area points
            11: {
                "title": "Melbourne Details",
                "description": "The cultural capital of Australia, known for its coffee culture, street art, and sports events.",
                "image": "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%23e67e22'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='18'%3EMelbourne%3C/text%3E%3C/svg%3E",
                "data": [
                    {"property": "Population", "value": "5.2 million"},
                    {"property": "Area", "value": "9,992 km²"},
                    {"property": "Founded", "value": "1835"},
                    {"property": "Time Zone", "value": "AEST (UTC+10)"}
                ]
            },
            12: {
                "title": "Geelong Details",
                "description": "Victoria's second largest city, known for its waterfront and proximity to the Surf Coast.",
                "image": "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%233498db'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='20'%3EGeelong%3C/text%3E%3C/svg%3E",
                "data": [
                    {"property": "Population", "value": "253,000"},
                    {"property": "Area", "value": "1,240 km²"},
                    {"property": "Distance from Melbourne", "value": "75 km SW"},
                    {"property": "Time Zone", "value": "AEST (UTC+10)"}
                ]
            },
            13: {
                "title": "Ballarat Details",
                "description": "Historic gold rush city with well-preserved Victorian architecture and Sovereign Hill.",
                "image": "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%23f1c40f'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='20'%3EBallarat%3C/text%3E%3C/svg%3E",
                "data": [
                    {"property": "Population", "value": "109,000"},
                    {"property": "Area", "value": "740 km²"},
                    {"property": "Distance from Melbourne", "value": "105 km NW"},
                    {"property": "Notable for", "value": "Gold Rush history"}
                ]
            },
            14: {
                "title": "Bendigo Details",
                "description": "Regional city known for its Victorian architecture and thriving arts scene.",
                "image": "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%23e74c3c'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='20'%3EBendigo%3C/text%3E%3C/svg%3E",
                "data": [
                    {"property": "Population", "value": "118,000"},
                    {"property": "Area", "value": "3,048 km²"},
                    {"property": "Distance from Melbourne", "value": "150 km N"},
                    {"property": "Notable for", "value": "Art Gallery & Historic architecture"}
                ]
            },
            15: {
                "title": "Mornington Details",
                "description": "Coastal town on the beautiful Mornington Peninsula, popular for beaches and wineries.",
                "image": "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%2316a085'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='18'%3EMornington%3C/text%3E%3C/svg%3E",
                "data": [
                    {"property": "Population", "value": "25,000"},
                    {"property": "Type", "value": "Coastal town"},
                    {"property": "Distance from Melbourne", "value": "60 km S"},
                    {"property": "Known for", "value": "Beaches & wineries"}
                ]
            },
            16: {
                "title": "Dandenong Ranges Details",
                "description": "Mountain range and national park known for tall forests, gardens, and scenic railways.",
                "image": "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%2327ae60'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='16'%3EDandenong Ranges%3C/text%3E%3C/svg%3E",
                "data": [
                    {"property": "Type", "value": "Mountain range & National Park"},
                    {"property": "Elevation", "value": "633m (highest point)"},
                    {"property": "Distance from Melbourne", "value": "40 km E"},
                    {"property": "Famous for", "value": "Puffing Billy Railway"}
                ]
            },
            17: {
                "title": "Frankston Details",
                "description": "Bayside suburb known for its beaches, pier, and gateway to the Mornington Peninsula.",
                "image": "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%239b59b6'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='18'%3EFrankston%3C/text%3E%3C/svg%3E",
                "data": [
                    {"property": "Population", "value": "142,000"},
                    {"property": "Type", "value": "Bayside suburb"},
                    {"property": "Distance from Melbourne", "value": "40 km SE"},
                    {"property": "Known for", "value": "Beaches & pier"}
                ]
            },
            18: {
                "title": "St Kilda Details",
                "description": "Famous beachside suburb known for Luna Park, penguins, and vibrant nightlife.",
                "image": "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%23f39c12'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='20'%3ESt Kilda%3C/text%3E%3C/svg%3E",
                "data": [
                    {"property": "Population", "value": "19,000"},
                    {"property": "Type", "value": "Beachside suburb"},
                    {"property": "Distance from Melbourne", "value": "8 km S"},
                    {"property": "Famous for", "value": "Luna Park & penguins"}
                ]
            },
            19: {
                "title": "Richmond Details",
                "description": "Inner-city suburb known for Bridge Road shopping, Vietnamese food, and MCG proximity.",
                "image": "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%234a90e2'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='20'%3ERichmond%3C/text%3E%3C/svg%3E",
                "data": [
                    {"property": "Population", "value": "26,000"},
                    {"property": "Type", "value": "Inner-city suburb"},
                    {"property": "Distance from Melbourne", "value": "5 km E"},
                    {"property": "Known for", "value": "Bridge Road & MCG"}
                ]
            },
            20: {
                "title": "Footscray Details",
                "description": "Multicultural suburb known for its diverse food scene and University campus.",
                "image": "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%23d35400'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='18'%3EFootscray%3C/text%3E%3C/svg%3E",
                "data": [
                    {"property": "Population", "value": "17,000"},
                    {"property": "Type", "value": "Inner-west suburb"},
                    {"property": "Distance from Melbourne", "value": "8 km W"},
                    {"property": "Known for", "value": "Multicultural food scene"}
                ]
            }
        }
        
        if point_id in point_details:
            self.send_json_response(point_details[point_id])
        else:
            # Return default response for unknown points
            default_response = {
                "title": "Unknown Location",
                "description": "No details available for this location.",
                "image": "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='200' fill='%237f8c8d'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='white' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E",
                "data": []
            }
            self.send_json_response(default_response)
    
    def send_json_response(self, data):
        """Send a JSON response"""
        response_data = json.dumps(data, ensure_ascii=False, indent=2)
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(response_data.encode('utf-8'))

def main():
    # Change to the directory containing the web files
    web_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(web_dir)
    
    Handler = CustomHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Server running at http://localhost:{PORT}/")
        print("Press Ctrl+C to stop the server")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")

if __name__ == "__main__":
    main()