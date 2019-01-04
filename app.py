import os
from flask import Flask, jsonify, request, Response
import json

app = Flask(__name__)

port = int(os.getenv('PORT', '3000'))

books = [
    {
        'name': 'Lean Startup',
        'isbn': '9781628610253',
        'id': 1
    }
]
current_id = 2

def validBook(book):
    if ("name" in book and "isbn" in book):
        return True
    else:
        return False

@app.route('/api/books', methods=['POST'])
def add_book():
    request_data = request.get_json()
    if(validBook(request_data)):
        new_book = {
            "name": request_data['name'],
            "isbn": request_data['isbn'],
            "id": current_id
        }
        books.insert(0, new_book)
        current_id += 1
        return Response(json.dumps(new_book), 201, mimetype='application/json')
    else:
        return Response(
            json.dumps({"error": "Invalid book"}),
            400,
            mimetype='application/json'
        )

@app.route('/api/books/<int:id>', methods=['PUT'])
def update_book(id):
    request_data = request.get_json()
    existing_book = next(filter(lambda book: book['id'] == id, books), {})
    if(validBook(request_data) and existing_book):
        existing_book["name"] = request_data['name']
        existing_book["isbn"] =  request_data['isbn']
        return Response(json.dumps(existing_book), 204, mimetype='application/json')
    else:
        return Response(
            json.dumps({"error": "Invalid book"}),
            400,
            mimetype='application/json'
        )

@app.route('/api/books/<int:id>', methods=['DELETE'])
def delete_book(id):
    try:
        books.remove(next(filter(lambda book: book['id'] == id, books), {}))
        return Response({}, status=200, mimetype='application/json')
    except ValueError:
        return Response(
            json.dumps({"error": "Invalid book"}),
            400,
            mimetype='application/json'
        )

@app.route('/api/books/<int:id>')
def get_book(id):
    return jsonify({'data': next(filter(lambda book: book['id'] == id, books), {})})

@app.route('/api/books')
def get_books():
    return jsonify({'data': {'books': books}})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port)
