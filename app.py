import os
from web_app import create_app
from flask import send_from_directory

env = os.environ.get('WEBAPP_ENV', 'dev')
app = create_app('config.%sConfig' % env.capitalize())
port = int(os.getenv('PORT', '3000'))


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
