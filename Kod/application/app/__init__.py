from flask import Flask
from flask.ext.mail import Mail
from peewee import *

import os

# Added support for CORS requests
# https://flask-cors.readthedocs.org/en/latest/
from flask.ext.cors import CORS

cwd = os.getcwd()

frontend_dest = cwd + '/frontend/';

app = Flask(__name__, static_url_path='', static_folder=frontend_dest)
app.config.from_object( 'config' )
mail = Mail( app )
#CORS(app)

db = SqliteDatabase( app.config[ 'DATABASE' ], threadlocals = True )

from app.views import *
