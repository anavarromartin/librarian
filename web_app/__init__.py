from flask import Flask, send_from_directory
import json
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()

def create_app(object_name):
    from .book.controllers import book

    app = Flask(__name__, static_folder='react_app/build')
    app.config.from_object(object_name)
    db.init_app(app)
    migrate.init_app(app, db)

    app.register_blueprint(book)
    
    return app
