from flask import Flask, jsonify, request, Response
import json
from .models import Book
from flask import Blueprint
from flask_accept import accept

book = Blueprint('book', __name__)


@book.route('/api/books/<int:id>', methods=['PUT'])
@accept('application/json')
def update_book(id):
    request_data = request.get_json(force=True)
    existing_book = Book.get_book(id)
    if(validBook(request_data) and existing_book):
        Book.update_book(request_data['id'], request_data['name'], request_data['isbn'], request_data['authors'], request_data['imageLink'])
        return Response(json.dumps(convert_book_to_data(existing_book)), 204, mimetype='application/json')
    else:
        return Response(
            json.dumps({"error": "Invalid book"}),
            400,
            mimetype='application/json'
        )


@book.route('/api/books/<int:id>', methods=['DELETE'])
@accept('application/json')
def delete_book(id):
    try:
        Book.delete_book(id)
        return Response({}, status=200, mimetype='application/json')
    except ValueError:
        return Response(
            json.dumps({"error": "Invalid book"}),
            400,
            mimetype='application/json'
        )


@book.route('/api/books/<int:id>')
@accept('application/json')
def show_book(id):
    return jsonify({'data': convert_book_to_data(Book.get_book(id))})


def validBook(book):
    if ("name" in book and "isbn" in book and "authors" in book):
        return True
    else:
        return False

def convert_book_to_data(book):
    return {
            'name': book.name,
            'isbn': book.isbn,
            'authors': book.authors,
            'imageLink': book.imageLink,
            'id': book.id
        }
