from flask import jsonify, request
from app.api import bp
from app.models.user import User
from app import db
from flask_jwt_extended import create_access_token, jwt_required

@bp.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Missing JSON data'}), 400
    
    user = User.query.filter_by(username=data.get('username')).first()
    if user and user.check_password(data.get('password')):
        access_token = create_access_token(identity=user.id)
        return jsonify({'access_token': access_token}), 200
    return jsonify({'error': 'Invalid username or password'}), 401

@bp.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Missing JSON data'}), 400
    
    if User.query.filter_by(username=data.get('username')).first():
        return jsonify({'error': 'Username already exists'}), 400
        
    user = User(username=data.get('username'), email=data.get('email'))
    user.set_password(data.get('password'))
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'}), 201