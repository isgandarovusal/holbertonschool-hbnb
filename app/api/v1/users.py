from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.persistence import facade

users_bp = Blueprint('users', __name__)

@users_bp.route('/me', methods=['PUT'])
@jwt_required()
def update_user_profile():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Email və password yenilənməsinə icazə verilmir (təhlükəsizlik üçün)
    data.pop('email', None)
    data.pop('password', None)
    
    updated_user = facade.update_user(current_user_id, data)
    return jsonify(updated_user), 200
