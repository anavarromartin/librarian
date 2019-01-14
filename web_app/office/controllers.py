from flask import Flask, jsonify, request, Response
import json
from .models import Office
from ..book.models import Book
from flask import Blueprint
from flask_accept import accept
from ..book.controllers import convert_book_to_data, validBook

office = Blueprint('office', __name__)


@office.route('/api/offices')
@accept('application/json')
def get_offices():
    return jsonify({'data': {'offices': list(map(lambda office: convert_office_to_data(office), Office.get_all_offices()))}})


@office.route('/api/offices', methods=['POST'])
@accept('application/json')
def add_office():
    try:
        request_data = request.get_json(force=True)
        new_office = Office.add_office(request_data['name'])
        return Response(json.dumps({'data': {'office': convert_office_to_data(new_office)}}), 201, mimetype='application/json')
    except Exception as e:
        print(e)
        return Response(
            json.dumps({"error": "Invalid office"}),
            400,
            mimetype='application/json'
        )


@office.route('/api/offices/<int:office_id>/books', methods=['POST'])
@accept('application/json')
def add_book(office_id):
    try:
        request_data = request.get_json(force=True)
        if(validBook(request_data)):
            new_book = Office.add_book_to_office(office_id, Book(
                name=request_data['name'], isbn=request_data['isbn'], authors=request_data['authors'], imageLink=request_data['imageLink']))
            return Response(json.dumps({'data': {'book': convert_book_to_data(new_book)}}), 201, mimetype='application/json')
    except:
        return Response(
            json.dumps({"error": "Invalid book"}),
            400,
            mimetype='application/json'
        )


@office.route('/api/offices/<int:office_id>/books')
@accept('application/json')
def get_books(office_id):
    return jsonify({'data': {'books': list(map(lambda book: convert_book_to_data(book), reversed(list(Office.get_all_books(office_id)))))}})


def convert_office_to_data(office):
    return {
        'name': office.name,
        'books': list(map(lambda book: convert_book_to_data(book), office.books)),
        'id': office.id
    }
