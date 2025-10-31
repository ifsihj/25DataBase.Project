from flask import jsonify, request
from app.api import bp

@bp.route('/projects', methods=['GET'])
def get_projects():
    return jsonify({'message': 'List of projects'})