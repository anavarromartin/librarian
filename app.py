import os
from flask import Flask, jsonify, request, Response, send_from_directory
import json
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

from book_repository import *

port = int(os.getenv('PORT', '3000'))

def validBook(book):
    if ("name" in book and "isbn" in book):
        return True
    else:
        return False

def convert_book_to_data(book):
    return {
            'name': book.name,
            'isbn': book.isbn,
            'id': book.id
        }

@app.route('/api/books', methods=['POST'])
def add_book():
    request_data = request.get_json()
    if(validBook(request_data)):
        new_book = BookRepository.add_book(request_data['name'], request_data['isbn'])
        return Response(json.dumps(convert_book_to_data(new_book)), 201, mimetype='application/json')
    else:
        return Response(
            json.dumps({"error": "Invalid book"}),
            400,
            mimetype='application/json'
        )

@app.route('/api/books/<int:id>', methods=['PUT'])
def update_book(id):
    request_data = request.get_json()
    existing_book = BookRepository.get_book(id)
    if(validBook(request_data) and existing_book):
        BookRepository.update_book(request_data['id'], request_data['name'], request_data['isbn'])
        return Response(json.dumps(convert_book_to_data(existing_book)), 204, mimetype='application/json')
    else:
        return Response(
            json.dumps({"error": "Invalid book"}),
            400,
            mimetype='application/json'
        )

@app.route('/api/books/<int:id>', methods=['DELETE'])
def delete_book(id):
    try:
        BookRepository.delete_book(id)
        return Response({}, status=200, mimetype='application/json')
    except ValueError:
        return Response(
            json.dumps({"error": "Invalid book"}),
            400,
            mimetype='application/json'
        )

@app.route('/api/books/<int:id>')
def show_book(id):
    return jsonify({'data': convert_book_to_data(BookRepository.get_book(id))})

@app.route('/api/books')
def get_books():
    print(list(map(lambda book: convert_book_to_data(book), BookRepository.get_all_books())))
    return jsonify({'data': {'books': list(map(lambda book: convert_book_to_data(book), BookRepository.get_all_books()))}})

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists("react_app/build/" + path):
        return send_from_directory('react_app/build', path)
    else:
        return send_from_directory('react_app/build', 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port)
