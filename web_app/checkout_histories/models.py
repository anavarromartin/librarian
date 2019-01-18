from datetime import datetime
from .. import db
import json


class CheckoutHistory(db.Model):
    __tablename__ = 'checkout_histories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    checkout_time = db.Column(db.DateTime)
    checkin_time = db.Column(db.DateTime, nullable=True)
    book_id = db.Column(db.Integer(), db.ForeignKey('books.id'))

    def __init__(self, name, email, checkout_time, checkin_time, book_id):
        self.name = name
        self.email = email
        self.checkout_time = checkout_time
        self.checkin_time = checkin_time
        self.book_id = book_id

    def add_checkout_history(_email, _name, _book_id):
        new_checkout_history = CheckoutHistory(
            name=_name,
            email=_email,
            checkout_time=datetime.utcnow(),
            checkin_time=None,
            book_id=_book_id
        )
        db.session.add(new_checkout_history)
        db.session.commit()
        db.session.refresh(new_checkout_history)
        return new_checkout_history

    def update_checkin(_id):
        updated_checkout_history = CheckoutHistory.query.filter_by(
            id=_id).first()
        updated_checkout_history.checkin_time = datetime.utcnow()
        db.session.commit()
        db.session.refresh(updated_checkout_history)
        return updated_checkout_history

    def __repr__(self):
        checkout_history = {
            'id': self.id,
            'checkout_time': self.checkout_time,
            'checkin_time': self.checkin_time,
            'email': self.email,
            'name': self.name,
        }
        return json.dumps(checkout_history)
