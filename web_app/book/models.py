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
    checkout_histories = db.relationship(
           'CheckoutHistory',
           backref='checkout_history',
           lazy='dynamic',
           cascade='delete'
    )

    def __init__(self, name, isbn, authors, imageLink, category='', id=None):
        self.id = id
        self.name = name
        self.isbn = isbn
        self.authors = authors
        self.imageLink = imageLink
        self.category = category

    def is_available(self):
        histories = list(self.checkout_histories)
        if len(histories) == 0:
            return True

        return histories[-1].checkin_time != None

    def get_book(_id):
        return Book.query.filter_by(id=_id).first()

    def get_all_books():
        return Book.query.all()

    def delete_book(_id):
        book_query = Book.query.filter_by(id=_id)
        book_query.first().checkout_histories.delete()
        book_query.delete()
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
