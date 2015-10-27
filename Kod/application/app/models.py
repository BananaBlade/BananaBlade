import peewee

from datetime import datetime
from peewee import *

from app import db
from app.definitions import *
from app.helpers import generate_activation_code

class BaseModel( Model ):
    """Tell peewee to use app-specific database"""
    class Meta:
        database = db


class Track( BaseModel ):
    """Track model

    Track itself is stored on the server as a file, whose location is in the `path` field.
    `Name`, `path`, `artist` and `duration` fields are mandatory, others could be undefined.
    """
    name            = CharField()
    path            = CharField()
    artist          = CharField()
    album           = CharField( null = True )
    duration        = IntegerField()                 # in seconds
    file_format     = CharField( null = True )
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
    """User model, for all types"""
    first_name      = CharField()
    last_name       = CharField()
    occupation      = CharField()
    email           = CharField( unique = True )
    password_hash   = CharField()
    account_type    = IntegerField( default = AccountType.USER )
    last_active     = DateTimeField( null = True )
    activation_code = CharField( null = True )

    @classmethod
    def authenticate_user( cls, email, password_hash ):
        user = cls.get( User.email == email )

        if user.password_hash != password_hash:
            raise AuthenticationError( 'Netočna lozinka' )

        return user

    @classmethod
    def create_user( cls, first_name, last_name, occupation, email, password_hash ):
        user = cls( first_name = first_name, last_name = last_name, occupation = occupation, email = email, password_hash = password_hash )
        user.save()
        user.activation_code = generate_activation_code( user.id )
        user.save()
        return user

    @classmethod
    def delete_user( cls, id ):
        user = User.get( User.id == id )
        user.delete_instance()

    def update_activity( self ):
        self.last_activity = datetime.now()
        self.save()

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


class PlaylistTrack( BaseModel ):
    """Model of a track on a slot playlist"""
    slot            = ForeignKeyField( Slot, related_name = "tracks" )
    track           = ForeignKeyField( Track )
    index           = IntegerField()
    play_duration   = IntegerField()


class Wish( BaseModel ):
    """Model of a wishlist - all users' wishes"""
    track           = ForeignKeyField( Track )
    user            = ForeignKeyField( User )
    date_time       = DateTimeField()
    is_temporary    = BooleanField( default = True )


class Notification( BaseModel ):
    """Model of a simple notification"""
    user            = ForeignKeyField( User, related_name = 'notifications' )
    category        = IntegerField( default = NotificationCategory.INFO )
    text            = CharField()
    date_time       = DateTimeField()
    seen            = BooleanField( default = False )
