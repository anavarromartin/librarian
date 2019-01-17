import os
from web_app import create_app
from flask import send_from_directory
from web_app.user.models import User, users
import flask_login

env = os.environ.get('WEBAPP_ENV', 'dev')
app = create_app('config.%sConfig' % env.capitalize())
port = int(os.getenv('PORT', '3000'))
login_manager = app.login_manager

@login_manager.user_loader
def user_loader(username):
    print("me")
    if username not in users:
        return

    user = User()
    user.id = username
    return user


@login_manager.unauthorized_handler
def unauthorized_handler():
    return 'Unauthorized'

@login_manager.request_loader
def request_loader(request):
    print("myself")
    username = request.form.get('username')
    if username not in users:
        return

    user = User()
    user.id = username

    user.is_authenticated = request.form['password'] == users[username]['password']

    return user

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(_react_app_dir(), path)):
        return send_from_directory(_react_app_dir(), path)
    else:
        return send_from_directory(_react_app_dir(), 'index.html')

def _root_dir():
	return os.path.abspath(os.path.dirname(__file__))

def _react_app_dir():
	return os.path.join(_root_dir(), 'react_app/build')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port, use_reloader=True, threaded=True)
