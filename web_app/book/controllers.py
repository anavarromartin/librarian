from flask import Flask, jsonify, request, Response
import json
from .models import Book
from flask import Blueprint

book = Blueprint('book', __name__)

@book.route('/api/books', methods=['POST'])
def add_book():
    request_data = request.get_json()
    if(validBook(request_data)):
        new_book = Book.add_book(request_data['name'], request_data['isbn'])
        return Response(json.dumps(convert_book_to_data(new_book)), 201, mimetype='application/json')
    else:
        return Response(
            json.dumps({"error": "Invalid book"}),
            400,
            mimetype='application/json'
        )


@book.route('/api/books/<int:id>', methods=['PUT'])
def update_book(id):
    request_data = request.get_json()
    existing_book = Book.get_book(id)
    if(validBook(request_data) and existing_book):
        Book.update_book(request_data['id'], request_data['name'], request_data['isbn'])
        return Response(json.dumps(convert_book_to_data(existing_book)), 204, mimetype='application/json')
    else:
        return Response(
            json.dumps({"error": "Invalid book"}),
            400,
            mimetype='application/json'
        )


@book.route('/api/books/<int:id>', methods=['DELETE'])
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
def show_book(id):
    return jsonify({'data': convert_book_to_data(Book.get_book(id))})


@book.route('/api/books')
def get_books():
    return jsonify({'data': {'books': list(map(lambda book: convert_book_to_data(book), Book.get_all_books()))}})


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
