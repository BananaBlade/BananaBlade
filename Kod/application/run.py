from app import app, db
from app.models import *

db.create_tables( [ Track, User, TimeSlot, PlaylistItem, Wish, Notification ], safe = True )
app.run( debug = True )
