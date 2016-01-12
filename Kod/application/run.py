from app import app, db
from app.models import *
from app.views import *

db.create_tables( [ Track, User, Slot, SlotRequest, PlaylistTrack, Wish, RadioStation ], safe = True )
app.run( debug = True, port = 80 )
