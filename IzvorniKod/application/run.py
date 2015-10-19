from app import app, db

db.create_tables( [ Track, User, TimeSlot, PlaylistItem, Wish, Notification ], safe = True )
app.run( debug = True )
