from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app.models.user import User
# Fərz edək ki, user-ləri tapmaq üçün bir metodunuz var (məs. facade)
# Burada sadələşdirilmiş məntiq verilir:
from app.persistence import facade 

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = facade.get_user_by_email(email)
    if user and user.verify_password(password):
        # is_admin claim-ini tokenə əlavə edirik
        access_token = create_access_token(identity=user.id, additional_claims={"is_admin": user.is_admin})
        return jsonify(access_token=access_token), 200
    
    return jsonify({"msg": "Bad email or password"}), 401
