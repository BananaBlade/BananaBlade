from app import app, db
from app.models import *

db.create_tables( [ Track, User, Slot, PlaylistItem ], safe = True )
app.run( debug = True )
