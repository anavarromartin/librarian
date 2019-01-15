from flask import Flask, jsonify, request, Response
import json
from .models import Office
from ..book.models import Book
from flask import Blueprint
from flask_accept import accept
from ..book.controllers import convert_book_to_data, validBook
import bleach

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
            for _ in range(int(request_data.get('quantity', 1))):
                new_book = Office.add_book_to_office(
                    office_id,
                    Book(
                        name=request_data['name'],
                        isbn=request_data['isbn'],
                        authors=request_data['authors'],
                        imageLink=request_data['imageLink'],
                        category=request_data['category']
                    )
                )
            return Response(json.dumps({'data': {'book': convert_book_to_data(new_book)}}), 201, mimetype='application/json')
    except Exception as exception:
        print(exception)
        return Response(
            json.dumps({"error": "Invalid book"}),
            400,
            mimetype='application/json'
        )


@office.route('/api/offices/<int:office_id>/books')
@accept('application/json')
def get_books_by_office(office_id):
    search_criteria = request.args.get('search')
    if(search_criteria != None and search_criteria != ''):
        sanitized_search_criteria = bleach.clean(search_criteria)
    else:
        sanitized_search_criteria = search_criteria
    return jsonify({'data': {'books': list(map(lambda book: convert_book_to_data(book), reversed(list(Office.get_all_books(office_id, sanitized_search_criteria)))))}})


def convert_office_to_data(office):
    return {
        'name': office.name,
        'books': list(map(lambda book: convert_book_to_data(book), office.books)),
        'id': office.id
    }
