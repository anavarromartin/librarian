import unittest
from web_app import create_app, db
from flask_sqlalchemy import SQLAlchemy
import json
from web_app.book.models import Book
from web_app.office.models import Office


class OfficeControllerTest(unittest.TestCase):
    def setUp(self):
        app = create_app('config.TestConfig')
        self.client = app.test_client()
        db.app = app
        db.create_all()

    def tearDown(self):
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
                        'books': [
                            {
                                "authors": "Kent Beck",
                                "id": 53,
                                "imageLink": "http://books.google.com/books/content?id=1234",
                                "isbn": "9780321146533",
                                "name": "Test-driven Development"
                            }
                        ],
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
                    'books': [],
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
                "name": "Practical Object Oriented Design In Ruby"
            }),
            headers={'Accept': 'application/json'}
        )
        assert response.status_code == 201
        assert json.loads(response.get_data(as_text=True)) == {
            'data': {
                'book': {
                    "authors": "Sandi Metz",
                    "id": 1,
                    "imageLink": "http://books.google.com/books/content?id=1234",
                    "isbn": "9780321146533",
                    "name": "Practical Object Oriented Design In Ruby"
                }
            }
        }

    def test_returns_all_books_for_office(self):
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
                                "name": "Test-driven Development"
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
            Book(id=53,
                 name="Test-driven Development",
                 isbn="9780321146533",
                 authors="Kent Beck",
                 imageLink="http://books.google.com/books/content?id=1234"
                 )
        )
        new_office.books.append(
            Book(id=54,
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
                                "name": "Test-driven Development"
                    }
                ]
            }
        }

    def test_returns_books_for_office_filtered_by_search_criteria_by_book_author(self):
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
        new_office.books.append(
            Book(id=54,
                 name="something random",
                 isbn="9999999999999",
                 authors="Rando More",
                 imageLink="http://books.google.com/books/content?id=1234"
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
                                "name": "Test-driven Development"
                    }
                ]
            }
        }


if __name__ == '__main__':
    unittest.main()
