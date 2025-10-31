from flask import jsonify, request
from app.api import bp

@bp.route('/discussions', methods=['GET'])
def get_discussions():
    return jsonify({'message': 'List of discussions'})