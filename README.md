# App for managing library in Dallas Office

## Run locally

1. Install PostgreSQL
1. Create Database `create database librarian;`
1. Install [Python](http://docs.python-guide.org/en/latest/starting/installation/)
1. Install Setuptools and pip (see guide above)
1. `export FLASK_APP=/path/to/app.py`
1. `export FLASK_DEBUG=1`
1. `export FLASK_RUN_PORT=3000`
1. `export DATABASE_URL="postgresql://localhost:5432/librarian?user=postgres&password=postgres"`
1. Install Virtualenv (acconplish this by running `pip install virtualenv`)
1. Run `virtualenv venv`
1. Run `source venv/bin/activate` on Mac OS X/Linux or`venv\Scripts\activate.bat` on windows
1. Run `pip install -r requirements.txt`
1. Migrate database `flask db upgrade`
1. Run `flask run`
1. Visit [http://localhost:3000](http://localhost:3000)

## Adding new migrations
1. `flask db migrate`

## Run tests
1. `flask test`
1. `cd react_app && CI=true yarn test`

## Run in the cloud

1. Install the [cf CLI](https://github.com/cloudfoundry/cli#downloads)
1. Run `cf push`
1. Visit the given URL
