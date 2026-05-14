from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.persistence import facade

reviews_bp = Blueprint('reviews', __name__)

@reviews_bp.route('/', methods=['POST'])
@jwt_required()
def create_review():
    user_id = get_jwt_identity()
    data = request.get_json()
    place_id = data.get('place_id')
    
    place = facade.get_place(place_id)
    if not place:
        return jsonify({"error": "Place not found"}), 404
        
    # 1. Öz yerinə rəy yaza bilməz
    if place.owner_id == user_id:
        return jsonify({"error": "You cannot review your own place"}), 400
        
    # 2. Eyni yerə təkrar rəy yaza bilməz
    existing_reviews = facade.get_reviews_by_place(place_id)
    if any(r.user_id == user_id for r in existing_reviews):
        return jsonify({"error": "You have already reviewed this place"}), 400
        
    data['user_id'] = user_id
    new_review = facade.create_review(data)
    return jsonify(new_review), 201
