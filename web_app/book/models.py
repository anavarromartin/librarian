from .. import db
import json


class Book(db.Model):
    __tablename__ = 'books'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    isbn = db.Column(db.String(80))
    authors = db.Column(db.String(80))
    imageLink = db.Column(db.String(2000))
    category = db.Column(db.String(80))
    office_id = db.Column(db.Integer(), db.ForeignKey('offices.id'))

    def __init__(self, name, isbn, authors, imageLink, category='', id=None):
        self.id = id
        self.name = name
        self.isbn = isbn
        self.authors = authors
        self.imageLink = imageLink
        self.category = category


    def add_book(_name, _isbn, _authors, _imageLink, _category=''):
        new_book = Book(
            name=_name,
            isbn=_isbn,
            authors=_authors,
            imageLink=_imageLink,
            category=_category
        )
        db.session.add(new_book)
        db.session.commit()
        db.session.refresh(new_book)
        return new_book

    def get_book(_id):
        return Book.query.filter_by(id=_id).first()

    def get_all_books():
        return Book.query.all()

    def delete_book(_id):
        Book.query.filter_by(id=_id).delete()
        db.session.commit()

    def update_book(_id, _name, _isbn):
        existing_book = Book.query.filter_by(id=_id).first()
        existing_book.name = _name
        existing_book.isbn = _isbn
        db.session.commit()

    def __repr__(self):
        book = {
            'id': self.id,
            'name': self.name,
            'isbn': self.isbn,
            'authors': self.authors,
            'imageLink': self.imageLink,
            'category': self.category
        }
        return json.dumps(book)
