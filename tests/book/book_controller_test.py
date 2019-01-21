import unittest
from web_app import create_app, db
from flask_sqlalchemy import SQLAlchemy
import json
from web_app.book.models import Book
from flask_jwt_extended import JWTManager, create_access_token
from web_app.office.models import Office
from datetime import datetime
from web_app.checkout_histories.models import CheckoutHistory

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
        db.session.query(Office).delete()
        db.session.commit()

    def tearDown(self):
        db.session.query(Book).delete()
        db.session.query(Office).delete()
        db.session.commit()
        db.session.remove()
        db.drop_all()

    def test_updates_specific_book_status_to_checked_out(self):
        new_office = Office(id=1, name="Dallas")
        db.session.add(new_office)
        db.session.commit()
        db.session.refresh(new_office)
        new_office.books.append(
            Book(id=53,
                 name="Test-driven Development",
                 isbn="9780321146533",
                 authors="Kent Beck",
                 imageLink="http://books.google.com/books/content?id=1234"
                 )
        )
        db.session.commit()

        response = self.client.patch(
            '/api/books/53?checkout=true',
            data=json.dumps({
                "email": "bob@example.com",
                "name": "bob",
            }),
            headers={'Accept': 'application/json'}
        )
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
                "available_quantity": 0,
                "checkout_histories": [
                    {
                        "email": "bob@example.com",
                        "name": "bob",
                        "checkout_time": datetime.utcnow().strftime("%a, %d %b %Y %H:%M:%S GMT"),
                        "checkin_time": None,
                        "id": 1
                    }
                ]
            }
        }

    def test_updates_specific_book_status_from_checked_out_to_checked_in(self):
        new_office = Office(id=1, name="Dallas")
        db.session.add(new_office)
        db.session.commit()
        db.session.refresh(new_office)
        new_office.books.append(
            Book(id=53,
                 name="Test-driven Development",
                 isbn="9780321146533",
                 authors="Kent Beck",
                 imageLink="http://books.google.com/books/content?id=1234"
                 )
        )
        db.session.commit()
        db.session.add(
            CheckoutHistory(
                email='bob@example.com',
                name='bob',
                checkout_time=datetime(2019, 1, 1, 23, 59, 59),
                checkin_time=None,
                book_id=new_office.books[0].id
            )
        )
        db.session.commit()

        response = self.client.patch(
            '/api/books/53?checkout=false',
            data=json.dumps({
                "email": "bob@example.com",
                "name": "bob",
            }),
            headers={'Accept': 'application/json'}
        )
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
                "available_quantity": 1,
                "checkout_histories": [
                    {
                        "email": "bob@example.com",
                        "name": "bob",
                        "checkout_time": 'Tue, 01 Jan 2019 23:59:59 GMT',
                        "checkin_time": datetime.utcnow().strftime("%a, %d %b %Y %H:%M:%S GMT"),
                        "id": 1
                    }
                ]
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
