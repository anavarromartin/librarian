from .. import db
import json
from ..book.models import Book

class Office(db.Model):
    __tablename__ = 'offices'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    books = db.relationship(
           'Book',
           backref='book',
           lazy='dynamic'
    )

    def add_office(_name):
        new_office = Office(name=_name, books=list())
        db.session.add(new_office)
        db.session.commit()
        db.session.refresh(new_office)
        return new_office


    def add_book_to_office(_id, book):
        office = Office.query.filter_by(id=_id).first()
        office.books.append(book)
        db.session.commit()
        db.session.refresh(book)
        return book

    def get_office(_id):
    	return Office.query.filter_by(id=_id).first()

    def get_all_offices():
        return Office.query.all()

    def get_all_books(_id):
        return Office.query.filter_by(id=_id).first().books

    def __repr__(self):
        office = {
            'name': self.name
        }
        return json.dumps(office)

