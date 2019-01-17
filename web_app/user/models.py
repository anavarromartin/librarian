import flask_login

users = {'admin': {'password': 'admin'}}

class User(flask_login.UserMixin):
    pass
