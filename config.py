import os


class Config(object):
    UPDATED_MYSQL_DATABASE_URI = os.environ['DATABASE_URL'].replace('mysql2://', 'mysql+pymysql://').replace('?reconnect=true', '')
    SQLALCHEMY_DATABASE_URI = UPDATED_MYSQL_DATABASE_URI
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'bulgogi'


class ProdConfig(Config):
    pass


class DevConfig(Config):
    DEBUG = True


class TestConfig(Config):
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(os.path.abspath(os.path.dirname(__file__)), 'test.db')
