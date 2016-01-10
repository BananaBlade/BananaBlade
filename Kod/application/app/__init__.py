from flask import Flask
from flask.ext.mail import Mail
from peewee import *

# Added support for CORS requests
# https://flask-cors.readthedocs.org/en/latest/
from flask.ext.cors import CORS

app = Flask(__name__)
app.config.from_object( 'config' )
mail = Mail( app )
CORS(app)

db = SqliteDatabase( app.config[ 'DATABASE' ], threadlocals = True )

from app.views import *
