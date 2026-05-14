from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.utils.auth import admin_required
from app.persistence import facade

amenities_bp = Blueprint('amenities', __name__)

@amenities_bp.route('/', methods=['POST'])
@jwt_required()
@admin_required()
def create_amenity():
    data = request.get_json()
    new_amenity = facade.create_amenity(data)
    return jsonify(new_amenity), 201

@amenities_bp.route('/<amenity_id>', methods=['PUT'])
@jwt_required()
@admin_required()
def update_amenity(amenity_id):
    data = request.get_json()
    updated_amenity = facade.update_amenity(amenity_id, data)
    return jsonify(updated_amenity), 200
