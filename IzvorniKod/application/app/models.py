from peewee import *
from app import db
from app.definitions import *

class BaseModel( Model ):
    """Tell peewee to use the app-specific database"""
    class Meta:
        database = db


class Track( BaseModel ):
    """Track model"""
    name            = CharField( unique = True )
    artist          = CharField()
    genre           = CharField()
    publisher       = CharField()
    carrier_type    = CharField()
    duration        = IntField()
    year            = IntField()
    file_format     = CharField()
    sample_rate     = FloatField()
    bits_per_sample = IntField()

    class Meta:
        order_by = ( 'artist', 'name' )

class User( BaseModel ):
    """User model, account type is one of the app.definitions.AccountType options"""
    first_name      = CharField()
    last_name       = CharField()
    occupation      = CharField()
    email           = CharField( unique = True )
    password_hash   = CharField()
    account_type    = IntField()
    active          = BoolField()
    activation_code = CharField()

class TimeSlot( BaseModel ):
    """Model of a time slot assigned to a particular editor"""
    editor          = ForeignKeyField( User )
    time            = TimeField()

    class Meta:
        order_by = ( 'time' )

class TrackListItem( BaseModel ):
    """Model of an item on the track list"""
    track           = ForeignKeyField( Track )
    slot            = ForeignKeyField( TimeSlot )
    index_in_slot   = IntField()
    play_duration   = IntField()
