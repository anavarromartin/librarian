from flask import Flask, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity
from flask import Blueprint

loginController = Blueprint('loginController', __name__)

@loginController.route('/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify({"error": "Missing JSON in request"}), 400

    username = request.json.get('username', None)
    password = request.json.get('password', None)
    if not username:
        return jsonify({"error": "Missing username parameter"}), 400
    if not password:
        return jsonify({"error": "Missing password parameter"}), 400

    if username != 'admin' and password != 'admin':
        return jsonify({"error": "Bad username or password"}), 401

    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token), 200

