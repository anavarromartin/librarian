from flask import Flask, jsonify, request, Response
import json
from .models import Book
from flask import Blueprint
from flask_accept import accept
from flask_jwt_extended import jwt_required
from ..checkout_histories.models import CheckoutHistory

book = Blueprint('book', __name__)


@book.route('/api/books/<int:id>', methods=['DELETE'])
@accept('application/json')
@jwt_required
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
    book = Book.get_book(id)
    return jsonify({'data': convert_book_to_data(book, 1, 1 if book.is_available() else 0)})


@book.route('/api/books/<int:book_id>', methods=['PATCH'])
@accept('application/json')
def update_book_status(book_id):
    checkout = request.args.get('checkout')
    if checkout is None:
        return Response(
            json.dumps({"error": "Invalid checkout request"}),
            400,
            mimetype='application/json'
        )

    updated_book = Book.get_book(book_id)
    if checkout == 'true' and updated_book.is_available():
        email = request.get_json(force=True).get('email')
        name = request.get_json(force=True).get('name')
        CheckoutHistory.add_checkout_history(email, name, book_id)
    elif checkout == 'false' and not updated_book.is_available():
        email = request.get_json(force=True).get('email')
        name = request.get_json(force=True).get('name')
        CheckoutHistory.update_checkin(list(CheckoutHistory.query.filter_by(email=email, name=name, book_id=book_id))[-1].id)

    return jsonify({'data': convert_book_to_data(updated_book, 1, 1 if updated_book.is_available() else 0)})


def validBook(book):
    if ("name" in book and "authors" in book and "isbn" in book):
        return True
    else:
        return False


def convert_book_to_data(book, quantity, available_quantity):
    if(book == None):
        return {
            'name': '',
            'isbn': '',
            'authors': '',
            'imageLink': '',
            'category': '',
            'quantity': 0,
            'available_quantity': 0,
            'id': ''
        }

    return {
        'name': book.name,
        'isbn': book.isbn,
        'authors': book.authors,
        'imageLink': book.imageLink,
        'category': book.category,
        'quantity': quantity,
        'available_quantity': available_quantity,
        'checkout_histories': list(map(lambda checkout_history: _convert_checkout_history_to_data(checkout_history), book.checkout_histories)),
        'id': book.id
    }

def _convert_checkout_history_to_data(checkout_history):
    return {
        'id': checkout_history.id,
        'name': checkout_history.name,
        'email': checkout_history.email,
        'checkin_time': checkout_history.checkin_time,
        'checkout_time': checkout_history.checkout_time
    }