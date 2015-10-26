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
    sample_rate     = FloatField( null = True )      # in kHz
    bits_per_sample = IntegerField( null = True )
    genre           = CharField( null = True )
    publisher       = CharField( null = True )
    carrier_type    = CharField( null = True )
    year            = IntegerField( null = True )

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
    """User model, containing basic user data and some app-specific fields (last_active, activation_code)"""
    first_name      = CharField()
    last_name       = CharField()
    occupation      = CharField()
    email           = CharField( unique = True )
    password_hash   = CharField()
    account_type    = IntegerField()    # definitions.AccountType
    last_active     = DateTimeField()
    activation_code = CharField()


class Slot( BaseModel ):
    """Model of a single time slot assigned to an editor"""
    time            = DateTimeField();
    editor          = ForeignKeyField( User )


class SlotRequest( BaseModel ):
    """Model of a request for allocating a time slot to the editor"""
    time            = TimeField();
    editor          = ForeignKeyField( User )
    days_bit_mask   = IntegerField()    # Bitmask
    start_date      = DateField()
    end_date        = DateField()


class PlaylistItem( BaseModel ):
    """"""
    slot            = ForeignKeyField( Slot, related_name = "tracks" )
    track           = ForeignKeyField( Track )
    index           = IntegerField()


# class Notification( BaseModel ):
#     """ """
#     user            = ForeignKeyField( User, related_name = 'notifications' )
#     title           = CharField()
#     content         = CharField()
#     date_time       = DateTimeField()
#     seen            = BooleanField()
