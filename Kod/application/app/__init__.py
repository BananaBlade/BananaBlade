from flask import Flask
from flask.ext.mail import Mail
from peewee import *

import os

cwd = os.getcwd()
frontend_dest = os.path.join( cwd, 'frontend/' )

app = Flask( __name__, static_url_path = '', static_folder = frontend_dest )
app.config.from_object( 'config' )
mail = Mail( app )

db = SqliteDatabase( app.config[ 'DATABASE' ], threadlocals = True )

from app.views import *
