import os
import requests
from dotenv import load_dotenv
from pymongo import MongoClient
from recommendUsers import get_recommendations
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

load_dotenv()

connection_string = os.getenv('MONGO_URI')
client = MongoClient(connection_string)
db = client['test']
collection = db['users']

def get_all():
    cursor = collection.find({})
    cursor = list(cursor)
    return cursor

@app.route('/recommendations', methods=['POST'])
def get_similar_users():
    print('called')
    data = request.json
    name = data.get('name')
    
    if not name:
        return jsonify({"error": "Name is required"}), 400

    try:
        users = get_all()
        similar_users = get_recommendations(name, users)
        result = []
        for i in similar_users:
            temp = {'name': i['name'], 'bio': i['bio'], 'picture': i['picture'], 'journals': [{k: v for k, v in journal.items() if k != '_id'} for journal in i['journals']]}
            result.append(temp)
        # print(result)
        return jsonify({'status': True, 'users': result})
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500


API_KEY = os.getenv("API_KEY")
BASE_URL = 'https://api.opentripmap.com/0.1/en/places'

def get_location_coordinates(query):
    geocoding_url = f"{BASE_URL}/geoname?name={query}&apikey={API_KEY}"
    response = requests.get(geocoding_url)
    if response.status_code == 200:
        data = response.json()
        return data.get('lat'), data.get('lon')
    return None, None

def search_tourist_places(query):
    lat, lon = get_location_coordinates(query)
    if not lat or not lon:
        return {"error": "Location not found"}

    radius = 10000
    limit = 100
    search_url = f"{BASE_URL}/radius?radius={radius}&lon={lon}&lat={lat}&limit={limit}&apikey={API_KEY}"
    
    response = requests.get(search_url)
    if response.status_code == 200:
        places = response.json()['features']
        results = []
        for place in places:
            properties = place['properties']
            xid = properties.get('xid')
            if xid:
                details = get_place_details(xid)
                image_url = details.get('preview', {}).get('source', 'No image available')
                results.append({
                    'name': properties.get('name', 'Unnamed'),
                    'kinds': properties.get('kinds', '').split(','),
                    'rate': properties.get('rate', 'Not rated'),
                    'osm': f"https://www.openstreetmap.org/{properties.get('osm', 'No OSM link')}",
                    'image': image_url
                })
        return results
    else:
        return {"error": "Failed to fetch tourist places"}

def get_place_details(xid):
    detail_url = f"{BASE_URL}/xid/{xid}?apikey={API_KEY}"
    response = requests.get(detail_url)
    if response.status_code == 200:
        return response.json()
    return {}

@app.route('/search_places', methods=['GET'])
def api_search_places():
    query = request.args.get('query')
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400
    
    results = search_tourist_places(query)
    return jsonify(results)


if __name__ == '__main__':
    try:
        client.admin.command('ping')
        print("Successfully connected to MongoDB!")
        app.run(debug=True)
    except Exception as e:
        print(f"Connection failed: {e}")
    finally:
        client.close()
