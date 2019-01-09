from flask import Flask, send_from_directory
import json
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()

def create_app(object_name):
    from .book.controllers import book
    from .office.controllers import office

    app = Flask(__name__, static_folder='react_app/build')
    app.config.from_object(object_name)
    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)

    app.register_blueprint(book)
    app.register_blueprint(office)
    
    return app
