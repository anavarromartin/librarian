import unittest
from web_app import create_app, db
from flask_sqlalchemy import SQLAlchemy
import json
from web_app.book.models import Book
from flask_jwt_extended import JWTManager, create_access_token


class BookControllerTest(unittest.TestCase):
    def setUp(self):
        app = create_app('config.TestConfig')
        self.app = JWTManager(app)
        with app.test_request_context():
            self.access_token = create_access_token('test')
        self.client = app.test_client()
        db.app = app
        db.create_all()
        db.session.query(Book).delete()
        db.session.commit()

    def tearDown(self):
        db.session.query(Book).delete()
        db.session.commit()
        db.session.remove()
        db.drop_all()

    def test_show_book_returns_specific_book(self):
        db.session.add(
            Book(id=53,
                 name="Test-driven Development",
                 isbn="9780321146533",
                 authors="Kent Beck",
                 imageLink="http://books.google.com/books/content?id=1234"
                 )
        )
        db.session.commit()

        response = self.client.get(
            '/api/books/53', headers={'Accept': 'application/json'})
        assert response.status_code == 200
        assert json.loads(response.get_data(as_text=True)) == {
            "data": {
                "authors": "Kent Beck",
                "id": 53,
                "imageLink": "http://books.google.com/books/content?id=1234",
                "isbn": "9780321146533",
                "name": "Test-driven Development",
                "category": "",
                "quantity": 1,
                "available_quantity": 1
            }
        }

    def test_delete_book_deletes_specific_book(self):
        db.session.add(
            Book(id=53,
                 name="Test-driven Development",
                 isbn="9780321146533",
                 authors="Kent Beck",
                 imageLink="http://books.google.com/books/content?id=1234"
                 )
        )
        db.session.commit()

        response = self.client.delete(
            '/api/books/53',
            headers={
                'Accept': 'application/json',
                'Authorization': 'Bearer {}'.format(self.access_token)
            }
        )
        assert response.status_code == 200
        assert Book.query.filter_by(id=53).first() == None


if __name__ == '__main__':
    unittest.main()
