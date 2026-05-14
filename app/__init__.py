from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from config import config

db = SQLAlchemy()
jwt = JWTManager()

def create_app(config_name="default"):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    db.init_app(app)
    jwt.init_app(app)
    
    from .api.v1.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
    
    return app
