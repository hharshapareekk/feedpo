import base64
import io
import json
import os
from typing import Dict, List, Optional

os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'  # Disable oneDNN warnings

from deepface import DeepFace
from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
CONFIG = {
    'TEMP_IMAGE_PATH': 'temp_upload.jpg',
    'FACE_VERIFICATION_MODEL': 'Facenet',
    'FACE_DETECTOR_BACKEND': 'retinaface',
    'MIN_SIMILARITY_THRESHOLD': 0.6  # Adjust based on your needs
}

# Type definitions
Session = Dict[str, str]
User = Dict[str, str | List[Session]]

def load_users() -> List[User]:
    """Load user database from JSON file"""
    try:
        with open('users.json') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading users database: {str(e)}")
        return []

users_db: List[User] = load_users()

def verify_face(temp_image_path: str, user_image_path: str) -> bool:
    """Verify if two faces match using DeepFace"""
    try:
        result = DeepFace.verify(
            img1_path=temp_image_path,
            img2_path=user_image_path,
            model_name=CONFIG['FACE_VERIFICATION_MODEL'],
            detector_backend=CONFIG['FACE_DETECTOR_BACKEND'],
            distance_metric='cosine'
        )
        return result['verified'] and result['distance'] < CONFIG['MIN_SIMILARITY_THRESHOLD']
    except Exception as e:
        print(f"Face verification error: {str(e)}")
        return False

@app.route('/verify', methods=['POST'])
def verify():
    """Endpoint for face verification"""
    if not request.is_json:
        return jsonify({'error': 'Request must be JSON'}), 400

    data = request.get_json()
    if not data or 'image' not in data:
        return jsonify({'error': 'No image provided'}), 400

    try:
        # Process base64 image
        img_data = base64.b64decode(data['image'].split(',')[1])
        img = Image.open(io.BytesIO(img_data))
        img.save(CONFIG['TEMP_IMAGE_PATH'])

        # Verify against all users
        for user in users_db:
            if not os.path.exists(user['imagePath']):
                print(f"Image not found for user {user['id']}")
                continue

            if verify_face(CONFIG['TEMP_IMAGE_PATH'], user['imagePath']):
                return jsonify({
                    'verified': True,
                    'userId': user['id'],
                    'userName': user['name'],
                    'sessions': user.get('sessions', [])
                })

        return jsonify({
            'verified': False,
            'message': 'No matching user found'
        }), 404

    except Exception as e:
        return jsonify({
            'error': 'Face verification failed',
            'details': str(e)
        }), 500

    finally:
        # Clean up temp file
        if os.path.exists(CONFIG['TEMP_IMAGE_PATH']):
            os.remove(CONFIG['TEMP_IMAGE_PATH'])

@app.route('/users/<user_id>', methods=['GET'])
def get_user(user_id: str):
    """Endpoint to get specific user data"""
    user = next((u for u in users_db if u['id'] == user_id), None)
    if user:
        return jsonify({
            'id': user['id'],
            'name': user['name'],
            'sessions': user.get('sessions', [])
        })
    return jsonify({'error': 'User not found'}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)