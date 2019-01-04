from app import db
import json

class BookRepository(db.Model):
    __tablename__ = 'books'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    isbn = db.Column(db.String(80))

    def add_book(_name, _isbn):
        new_book = BookRepository(name=_name, isbn=_isbn)
        db.session.add(new_book)
        db.session.commit()
        db.session.refresh(new_book)
        return new_book

    def get_book(_id):
    	return BookRepository.query.filter_by(id=_id).first()

    def get_all_books():
        return BookRepository.query.all()

    def delete_book(_id):
    	BookRepository.query.filter_by(id=_id).delete()
    	db.session.commit()

    def update_book(_id, _name, _isbn):
    	existing_book = BookRepository.query.filter_by(id=_id).first()
    	existing_book.name = _name
    	existing_book.isbn = _isbn
    	db.session.commit()

    def __repr__(self):
        book = {
            'name': self.name,
            'isbn': self.isbn
        }
        return json.dumps(book)

