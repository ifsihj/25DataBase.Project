from flask import Blueprint

bp = Blueprint('api', __name__)

def init_app(app):
    from app.api import user, auth, project, discussion
    app.register_blueprint(bp, url_prefix='/api')