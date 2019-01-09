from .. import db
import json

class Book(db.Model):
    __tablename__ = 'books'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    isbn = db.Column(db.String(80))
    authors = db.Column(db.String(80))
    imageLink = db.Column(db.String(2000))
    office_id = db.Column(db.Integer(), db.ForeignKey('offices.id'))

    def add_book(_name, _isbn, _authors, _imageLink):
        new_book = Book(name=_name, isbn=_isbn, authors=_authors, imageLink=_imageLink)
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
            'name': self.name,
            'isbn': self.isbn
        }
        return json.dumps(book)

