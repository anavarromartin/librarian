from flask import Flask, send_from_directory
import json
from sqlalchemy import MetaData
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from . import commands
import flask_login

naming_convention = {
    "ix": 'ix_%(column_0_label)s',
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(column_0_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}
db = SQLAlchemy(metadata=MetaData(naming_convention=naming_convention))
migrate = Migrate()


def register_commands(app):
    """Register Click commands."""
    app.cli.add_command(commands.test)


def create_app(object_name):
    from .book.controllers import book
    from .office.controllers import office
    from .user.controllers import user

    app = Flask(__name__, static_folder='react_app/build')
    app.config.from_object(object_name)
    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db, render_as_batch=True)
    
    login_manager = flask_login.LoginManager()
    login_manager.init_app(app)

    app.register_blueprint(book)
    app.register_blueprint(office)
    app.register_blueprint(user)

    register_commands(app)

    return app
