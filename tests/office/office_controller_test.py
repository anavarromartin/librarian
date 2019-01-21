import unittest
from web_app import create_app, db
from flask_sqlalchemy import SQLAlchemy
import json
from web_app.book.models import Book
from web_app.office.models import Office
from flask_jwt_extended import JWTManager, create_access_token
from web_app.checkout_histories.models import CheckoutHistory
from datetime import datetime


class OfficeControllerTest(unittest.TestCase):
    def setUp(self):
        app = create_app('config.TestConfig')
        self.app = JWTManager(app)
        with app.test_request_context():
            self.access_token = create_access_token('test')
        self.client = app.test_client()

        db.app = app
        db.create_all()
        db.session.query(CheckoutHistory).delete()
        db.session.query(Book).delete()
        db.session.query(Office).delete()
        db.session.commit()

    def tearDown(self):
        db.session.query(CheckoutHistory).delete()
        db.session.query(Book).delete()
        db.session.query(Office).delete()
        db.session.commit()
        db.session.remove()
        db.drop_all()

    def test_offices_returns_all_offices(self):
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

        response = self.client.get(
            '/api/offices', headers={'Accept': 'application/json'})
        assert response.status_code == 200
        assert json.loads(response.get_data(as_text=True)) == {
            'data': {
                'offices': [
                    {
                        'id': 1,
                        'name': 'Dallas'
                    }
                ]
            }
        }

    def test_adds_an_office(self):
        response = self.client.post(
            '/api/offices',
            data=json.dumps({
                'name': 'Seattle'
            }),
            headers={'Accept': 'application/json'}
        )
        assert response.status_code == 201
        assert json.loads(response.get_data(as_text=True)) == {
            'data': {
                'office': {
                    'id': 1,
                    'name': 'Seattle'
                }
            }
        }

    def test_adds_a_book_to_an_office(self):
        new_office = Office(id=1, name="Dallas")
        db.session.add(new_office)
        db.session.commit()
        db.session.refresh(new_office)
        db.session.commit()

        response = self.client.post(
            '/api/offices/1/books',
            data=json.dumps({
                "authors": "Sandi Metz",
                "imageLink": "http://books.google.com/books/content?id=1234",
                "isbn": "9780321146533",
                "name": "Practical Object Oriented Design In Ruby",
                "category": ""
            }),
            headers={
                'Accept': 'application/json',
                'Authorization': 'Bearer {}'.format(self.access_token)
            }
        )
        assert response.status_code == 201
        assert json.loads(response.get_data(as_text=True)) == {
            'data': {
                'book': {
                    "authors": "Sandi Metz",
                    "id": 1,
                    "imageLink": "http://books.google.com/books/content?id=1234",
                    "isbn": "9780321146533",
                    "name": "Practical Object Oriented Design In Ruby",
                    "category": "",
                    "quantity": 1,
                    "available_quantity": 1,
                    "checkout_histories": []
                }
            }
        }

    def test_adds_multiple_of_a_book_to_an_office(self):
        new_office = Office(id=1, name="Dallas")
        db.session.add(new_office)
        db.session.commit()
        db.session.refresh(new_office)
        db.session.commit()

        response = self.client.post(
            '/api/offices/1/books',
            data=json.dumps({
                "authors": "Sandi Metz",
                "imageLink": "http://books.google.com/books/content?id=1234",
                "isbn": "9780321146533",
                "name": "Practical Object Oriented Design In Ruby",
                "category": "Testing",
                "quantity": "2"
            }),
            headers={
                'Accept': 'application/json',
                'Authorization': 'Bearer {}'.format(self.access_token)
            }
        )
        assert response.status_code == 201
        assert json.loads(response.get_data(as_text=True)) == {
            'data': {
                'book': {
                    "authors": "Sandi Metz",
                    "id": 2,
                    "imageLink": "http://books.google.com/books/content?id=1234",
                    "isbn": "9780321146533",
                    "name": "Practical Object Oriented Design In Ruby",
                    "category": "Testing",
                    "quantity": 1,
                    "available_quantity": 1,
                    "checkout_histories": []
                }
            }
        }
        assert len(Book.query.all()) == 2

    def test_returns_all_books_for_office_ordered_by_name(self):
        new_office = Office(id=1, name="Dallas")
        db.session.add(new_office)
        db.session.commit()
        db.session.refresh(new_office)
        new_office.books.append(
            Book(
                id=53,
                name="Test-driven Development",
                isbn="9780321146533",
                authors="Kent Beck",
                imageLink="http://books.google.com/books/content?id=1234"
            )
        )
        new_office.books.append(
            Book(
                id=2,
                name="Test-driven Development Second Edition",
                isbn="2222222222222",
                authors="Kent Beck",
                imageLink="http://books.google.com/books/content?id=1234"
            )
        )
        db.session.commit()

        response = self.client.get(
            '/api/offices/1/books',
            headers={'Accept': 'application/json'}
        )
        assert response.status_code == 200
        assert json.loads(response.get_data(as_text=True)) == {
            'data': {
                'books': [
                    {
                        "authors": "Kent Beck",
                        "id": 53,
                        "imageLink": "http://books.google.com/books/content?id=1234",
                        "isbn": "9780321146533",
                        "name": "Test-driven Development",
                        "category": "",
                        "quantity": 1,
                        "available_quantity": 1,
                        "checkout_histories": []
                    },
                    {
                        "authors": "Kent Beck",
                        "id": 2,
                        "imageLink": "http://books.google.com/books/content?id=1234",
                        "isbn": "2222222222222",
                        "name": "Test-driven Development Second Edition",
                        "category": "",
                        "quantity": 1,
                        "available_quantity": 1,
                        "checkout_histories": []
                    }
                ]
            }
        }

    def test_returns_all_books_for_office_grouped_by_isbn(self):
        new_office = Office(id=1, name="Dallas")
        db.session.add(new_office)
        db.session.commit()
        db.session.refresh(new_office)
        new_office.books.append(
            Book(
                id=53,
                name="Test-driven Development Second Edition",
                isbn="9780321146533",
                authors="Kent Beck",
                imageLink="http://books.google.com/books/content?id=1234"
            )
        )
        new_office.books.append(
            Book(
                id=54,
                name="Test-driven Development",
                isbn="9780321146533",
                authors="Kent Beck",
                imageLink="http://books.google.com/books/content?id=1234"
            )
        )
        db.session.commit()

        response = self.client.get(
            '/api/offices/1/books',
            headers={'Accept': 'application/json'}
        )
        assert response.status_code == 200
        assert json.loads(response.get_data(as_text=True)) == {
            'data': {
                'books': [
                    {
                        "authors": "Kent Beck",
                        "id": 54,
                        "imageLink": "http://books.google.com/books/content?id=1234",
                        "isbn": "9780321146533",
                        "name": "Test-driven Development",
                        "category": "",
                        "quantity": 2,
                        "available_quantity": 2,
                        "checkout_histories": []
                    }
                ]
            }
        }

    def test_returns_books_for_office_filtered_by_search_criteria_by_book_name(self):
        new_office = Office(id=1, name="Dallas")
        db.session.add(new_office)
        db.session.commit()
        db.session.refresh(new_office)
        new_office.books.append(
            Book(
                id=53,
                name="Test-driven Development",
                isbn="9780321146533",
                authors="Kent Beck",
                imageLink="http://books.google.com/books/content?id=1234"
            )
        )
        new_office.books.append(
            Book(
                id=54,
                name="something random",
                isbn="9999999999999",
                authors="Rando More",
                imageLink="http://books.google.com/books/content?id=1234"
            )
        )
        db.session.commit()

        response = self.client.get(
            '/api/offices/1/books?search=test',
            headers={'Accept': 'application/json'}
        )
        assert response.status_code == 200
        assert json.loads(response.get_data(as_text=True)) == {
            'data': {
                'books': [
                    {
                        "authors": "Kent Beck",
                        "id": 53,
                        "imageLink": "http://books.google.com/books/content?id=1234",
                        "isbn": "9780321146533",
                        "name": "Test-driven Development",
                        "category": "",
                        "quantity": 1,
                        "available_quantity": 1,
                        "checkout_histories": []
                    }
                ]
            }
        }

    def test_returns_all_books_when_books_with_given_isbn_exists(self):
        new_office = Office(id=1, name="Dallas")
        db.session.add(new_office)
        db.session.commit()
        db.session.refresh(new_office)
        new_office.books.append(
            Book(
                id=53,
                name="Test-driven Development",
                isbn="9780321146533",
                authors="Kent Beck",
                imageLink="http://books.google.com/books/content?id=1234"
            )
        )
        db.session.commit()

        response = self.client.get(
            '/api/offices/1/books/9780321146533',
            headers={'Accept': 'application/json'}
        )
        assert response.status_code == 200
        assert json.loads(response.get_data(as_text=True)) == {
            'data': {
                'books': [
                    {
                        "authors": "Kent Beck",
                        "id": 53,
                        "imageLink": "http://books.google.com/books/content?id=1234",
                        "isbn": "9780321146533",
                        "name": "Test-driven Development",
                        "category": "",
                        "quantity": 1,
                        "available_quantity": 1,
                        "checkout_histories": []
                    }
                ]
            }
        }

    def test_returns_only_checked_out_books_when_books_checked_out_sent(self):
        new_office = Office(id=1, name="Dallas")
        db.session.add(new_office)
        db.session.commit()
        db.session.refresh(new_office)
        new_office.books.append(
            Book(
                id=53,
                name="Test-driven Development",
                isbn="9780321146533",
                authors="Kent Beck",
                imageLink="http://books.google.com/books/content?id=1234"
            )
        )
        db.session.refresh(new_office)
        new_office.books.append(
            Book(
                id=54,
                name="Test-driven Development",
                isbn="9780321146533",
                authors="Kent Beck",
                imageLink="http://books.google.com/books/content?id=1234"
            )
        )
        db.session.commit()
        db.session.add(
            CheckoutHistory(
                name='bob',
                email='bob@example.com',
                checkout_time=datetime(2013, 1, 1, 21, 59, 59),
                checkin_time=None,
                book_id=new_office.books[0].id
            )
        )
        db.session.add(
            CheckoutHistory(
                name='bob',
                email='bob@example.com',
                checkout_time=datetime(2013, 1, 1, 21, 59, 59),
                checkin_time=datetime(2013, 1, 1, 23, 59, 59),
                book_id=new_office.books[1].id
            )
        )
        db.session.commit()

        response = self.client.get(
            '/api/offices/1/books?checked-out=true',
            headers={'Accept': 'application/json'}
        )
        assert response.status_code == 200
        assert json.loads(response.get_data(as_text=True)) == {
            'data': {
                'books': [
                    {
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
                                "name": "bob",
                                "email": "bob@example.com",
                                "checkout_time": "Tue, 01 Jan 2013 21:59:59 GMT",
                                "checkin_time": None,
                                "id": 1
                            }
                        ]
                    }
                ]
            }
        }

    def test_returns_object_with_empty_array_when_no_books_with_given_isbn_exists(self):
        new_office = Office(id=1, name="Dallas")
        db.session.add(new_office)
        db.session.commit()
        db.session.refresh(new_office)
        new_office.books.append(
            Book(
                id=53,
                name="Test-driven Development",
                isbn="9780321146533",
                authors="Kent Beck",
                imageLink="http://books.google.com/books/content?id=1234"
            )
        )
        db.session.commit()

        response = self.client.get(
            '/api/offices/1/books/2222222222222',
            headers={'Accept': 'application/json'}
        )
        assert response.status_code == 200
        assert json.loads(response.get_data(as_text=True)) == {
            'data': {
                'books': []
            }
        }

    def test_returns_books_for_office_filtered_by_search_criteria_by_book_author(self):
        new_office = Office(id=1, name="Dallas")
        db.session.add(new_office)
        db.session.commit()
        db.session.refresh(new_office)
        new_office.books.append(
            Book(
                id=53,
                name="Test-driven Development",
                isbn="9780321146533",
                authors="Kent Beck",
                imageLink="http://books.google.com/books/content?id=1234",
                category="Testing"
            )
        )
        new_office.books.append(
            Book(
                id=54,
                name="something random",
                isbn="9999999999999",
                authors="Rando More",
                imageLink="http://books.google.com/books/content?id=1234",
                category="Testing"
            )
        )
        db.session.commit()

        response = self.client.get(
            '/api/offices/1/books?search=Kent',
            headers={'Accept': 'application/json'}
        )
        assert response.status_code == 200
        assert json.loads(response.get_data(as_text=True)) == {
            'data': {
                'books': [
                    {
                        "authors": "Kent Beck",
                        "id": 53,
                        "imageLink": "http://books.google.com/books/content?id=1234",
                        "isbn": "9780321146533",
                        "name": "Test-driven Development",
                        "category": "Testing",
                        "quantity": 1,
                        "available_quantity": 1,
                        "checkout_histories": []
                    }
                ]
            }
        }


if __name__ == '__main__':
    unittest.main()
