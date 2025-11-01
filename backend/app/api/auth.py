from flask import jsonify, request, current_app
from app.api import bp
from app.models.user import User
from app import db
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

@bp.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Missing JSON data'}), 400
    
    user = User.query.filter_by(username=data.get('username')).first()
    # compute password check result (avoid logging password itself)
    pw_ok = False
    if user:
        try:
            pw_ok = bool(user.check_password(data.get('password')))
        except Exception as e:
            # in case password_hash is None or check raises
            current_app.logger.exception('Password check error')
            pw_ok = False

    current_app.logger.info(
        f"Login attempt username={data.get('username')!r} found_user={bool(user)} pw_ok={pw_ok}"
    )

    if user and pw_ok:
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
        
    # If email not provided by frontend, create a fallback so DB non-null constraint is satisfied
    email_val = data.get('email') or f"{data.get('username')}@local.invalid"
    user = User(username=data.get('username'), email=email_val)
    user.set_password(data.get('password'))
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'}), 201


@bp.route('/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'id': user.id, 'username': user.username, 'email': user.email}), 200