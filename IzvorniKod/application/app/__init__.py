from flask import Flask
from peewee import *

app = Flask( __name__ )
app.config.from_object( 'config' )

db = SqliteDatabase( app.config[ 'DATABASE' ], threadlocals = True )

from app.views import *
