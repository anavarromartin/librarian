from flask import Flask, jsonify, request, Response
import json
from .models import Book
from flask import Blueprint
from flask_accept import accept

book = Blueprint('book', __name__)


@book.route('/api/books/<int:id>', methods=['DELETE'])
@accept('application/json')
def delete_book(id):
    try:
        Book.delete_book(id)
        return Response({}, status=200, mimetype='application/json')
    except ValueError as e:
        print(e)
        return Response(
            json.dumps({"error": "Invalid book"}),
            400,
            mimetype='application/json'
        )


@book.route('/api/books/<int:id>')
@accept('application/json')
def show_book(id):
    return jsonify({'data': convert_book_to_data(Book.get_book(id), 1)})


def validBook(book):
    if ("name" in book and "authors" in book and "isbn" in book):
        return True
    else:
        return False


def convert_book_to_data(book, quantity):
    if(book == None):
        return {
            'name': '',
            'isbn': '',
            'authors': '',
            'imageLink': '',
            'category': '',
            'quantity': quantity,
            'id': ''
        }

    return {
        'name': book.name,
        'isbn': book.isbn,
        'authors': book.authors,
        'imageLink': book.imageLink,
        'category': book.category,
        'quantity': quantity,
        'id': book.id
    }
