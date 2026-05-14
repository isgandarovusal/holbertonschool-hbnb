from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.persistence import facade

places_bp = Blueprint('places', __name__)

@places_bp.route('/', methods=['POST'])
@jwt_required()
def create_place():
    user_id = get_jwt_identity()
    data = request.get_json()
    data['owner_id'] = user_id  # Yer sahibi avtomatik login olan user olur
    new_place = facade.create_place(data)
    return jsonify(new_place), 201

@places_bp.route('/<place_id>', methods=['PUT'])
@jwt_required()
def update_place(place_id):
    current_user_id = get_jwt_identity()
    place = facade.get_place(place_id)
    
    if not place:
        return jsonify({"error": "Place not found"}), 404
        
    if place.owner_id != current_user_id:
        return jsonify({"error": "Unauthorized action"}), 403
        
    data = request.get_json()
    updated_place = facade.update_place(place_id, data)
    return jsonify(updated_place), 200
