from flask import Flask
from flask.ext.mail import Mail
from peewee import *

app = Flask(__name__)
app.config.from_object( 'config' )
mail = Mail( app )

db = SqliteDatabase( app.config[ 'DATABASE' ], threadlocals = True )

from app.views import *
