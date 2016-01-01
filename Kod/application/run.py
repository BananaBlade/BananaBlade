from app import app, db
from app.models import *
from app.views import *

db.create_tables( [ Track, User, Slot, SlotRequest, PlaylistTrack, Wish ], safe = True )
app.run( debug = True )
