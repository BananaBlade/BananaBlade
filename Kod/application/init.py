from app import app, db
from app.models import *

db.connect()

for table in [ Track, User, Slot, SlotRequest, PlaylistTrack, Wish, RadioStation ]:
	db.create_table( table, safe = True )
	
db.close()
