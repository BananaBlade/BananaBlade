from peewee import *
from app import db
from app.definitions import *

class BaseModel( Model ):
    """Tell peewee to use app-specific database"""
    class Meta:
        database = db

class Track( BaseModel ):
    """Track model, has CRUD methods"""
    name            = CharField()
    artist          = CharField()
    duration        = IntegerField()    # in seconds
    file_format     = CharField()
    sample_rate     = FloatField()      # in kHz
    bits_per_sample = IntegerField()
    genre           = CharField()
    publisher       = CharField()
    carrier_type    = CharField()
    year            = IntegerField()

    class Meta:
        order_by = ( '+artist', '+name' )

    # Methods

    @classmethod
    def add_track( cls, **kwargs ):
        track = cls.create( **kwargs )
        track.save()
        return track

    @classmethod
    def edit_track( cls, id, **kwargs ):
        track = cls.get( Track.id == id )
        for attr, value in kwargs.items():
            track.__setattr__( attr, value )
        track.save()
        return track

    @classmethod
    def delete_track( cls, id ):
        track = cls.get( Track.id == id )
        track.delete_instance()

    @classmethod
    def get_tracks( cls, start = 0, limit = 20 ):
        return cls.select().paginate( start, limit )

class User( BaseModel ):
    """ """
    first_name      = CharField()
    last_name       = CharField()
    occupation      = CharField()
    email           = CharField( unique = True )
    password_hash   = CharField()
    account_type    = IntegerField()    # from 1 to 4
    active          = BooleanField()
    activation_code = CharField()

class TimeSlot( BaseModel ):
    """ """
    editor          = ForeignKeyField( User )
    time            = TimeField()

    class Meta:
        order_by = ( '+time' )

class PlaylistItem( BaseModel ):
    """ """
    track           = ForeignKeyField( Track )
    slot            = ForeignKeyField( TimeSlot )
    index_in_slot   = IntegerField()
    play_duration   = IntegerField()    # in seconds

class PlayRecord( BaseModel ):
    """ """
    track           = ForeignKeyField( Track )
    editor          = ForeignKeyField( User )
    date_time       = DateTimeField()

    class Meta:
        order_by = ( 'date_time' )

class Wish( BaseModel ):
    """ """
    track           = ForeginKeyField( Track )
    user            = ForeignKeyField( User, related_name = 'wishes' )
    date_time       = DateTimeField()

    class Meta:
        order_by = ( 'date_time' )

class Notification( BaseModel ):
    """ """
    user            = ForeignKeyField( User, related_name = 'notifications' )
    title           = CharField()
    content         = CharField()
    date_time       = DateTimeField()
    seen            = BooleanField()

    class Meta:
        order_by = ( '+seen', 'date_time', 'title' )
