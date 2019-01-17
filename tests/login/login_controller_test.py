import unittest
from web_app import create_app, db
import json
from flask_jwt_extended import JWTManager


class LoginControllerTest(unittest.TestCase):
    def setUp(self):
        app = create_app('config.TestConfig')
        self.app = JWTManager(app)
        self.client = app.test_client()
        db.app = app
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def test_return_access_token_when_correct_credentials_given(self):
        response = self.client.post(
            '/login',
            data=json.dumps({
                "username": "admin",
                "password": "admin",
            }),
            headers={'Accept': 'application/json'})
        assert response.status_code == 200
        assert len(json.loads(response.get_data(
            as_text=True)).get('access_token')) > 30

    def test_return_400_when_no_username_given(self):
        response = self.client.post(
            '/login',
            data=json.dumps({
                "password": "admin",
            }),
            headers={'Accept': 'application/json'})
        assert response.status_code == 400
        assert json.loads(response.get_data(as_text=True)).get('error') == "Missing username parameter"

    def test_return_400_when_no_password_given(self):
        response = self.client.post(
            '/login',
            data=json.dumps({
                "username": "admin",
            }),
            headers={'Accept': 'application/json'})
        assert response.status_code == 400
        assert json.loads(response.get_data(as_text=True)).get('error') == "Missing password parameter"

    def test_return_401_when_incorrect_username_given(self):
        response = self.client.post(
            '/login',
            data=json.dumps({
                "username": "bob",
                "password": "admin",
            }),
            headers={'Accept': 'application/json'})
        assert response.status_code == 401
        assert json.loads(response.get_data(as_text=True)).get('error') == "Bad username or password"

    def test_return_401_when_incorrect_password_given(self):
        response = self.client.post(
            '/login',
            data=json.dumps({
                "username": "admin",
                "password": "bob",
            }),
            headers={'Accept': 'application/json'})
        assert response.status_code == 401
        assert json.loads(response.get_data(as_text=True)).get('error') == "Bad username or password"


if __name__ == '__main__':
    unittest.main()
