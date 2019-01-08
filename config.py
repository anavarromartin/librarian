import os

class Config(object):
    SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'bulgogi'
 
class ProdConfig(Config):
	pass
 
class DevConfig(Config):
    DEBUG = True