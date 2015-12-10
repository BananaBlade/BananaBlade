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

    This model is a track representation, containing it's various
    metadata. The track itself is stored on the server as a music
    file, whose location is stored in the `path` field.
    `name`, `path`, `artist` and `duration` fields are mandatory.
    """
    album           = CharField( null = True )
    duration        = IntegerField()                 # in seconds
    file_format     = CharField( null = True )
    sample_rate     = FloatField( null = True )      # in kHz
    bits_per_sample = IntegerField( null = True )
    genre           = CharField( null = True )
    publisher       = CharField( null = True )
    carrier_type    = CharField( null = True )
    year            = IntegerField( null = True )

    @classmethod
    def add_track( cls, **kwargs ):
        track = cls.create( **kwargs )
        track.save
        return track

    @classmethod
    def edit_track( cls, track_id, **kwargs ):
        track = cls.get( Track.id == track_id )
        for attr, val in kwargs.items():
            track.__setattr__( attr, val )
        track.save()
        return track

    @classmethod
    def delete_track( cls, track_id ):
        cls.delete().where( Track.id == track__id ).execute()

    @classmethod
    def get_currently_playing( cls ):
        pass

    @classmethod
    def get_tracks( cls, start = 0, limit = 20 ):
        pass

    @classmethod
    def search_tracks( search_terms ):
        pass


class User( BaseModel ):
    """Model for all registered users
    """
    first_name      = CharField()
    last_name       = CharField()
    occupation      = CharField()
    email           = CharField( unique = True )
    password_hash   = CharField()
    account_type    = IntegerField( default = AccountType.USER )
    last_active     = DateTimeField( null = True )
    activated       = BooleanField( default = False )
    activation_code = CharField( null = True )

    @classmethod
    def authenticate_user( cls, email, password ):
        pass

    @classmethod
    def create_user( cls, first_name, last_name, occupation, email, password_hash ):
        pass

    @classmethod
    def delete_user( cls, user_id ):
        pass

    @classmethod
    def activate_user( cls, activation_code ):
        pass

    @classmethod
    def list_active_admins( cls ):
        pass

    @classmethod
    def count_active_users( cls ):
        pass

    def change_password( self, old_password_hash, new_password_hash ):
        pass

    def modify_account( self, first_name, last_name, occupation, email ):
        pass

    def update_activity( self ):
        pass

    def _assert_admin( self ):
        pass

    def _assert_editor( self ):
        pass

    def _assert_owner( self ):
        pass

    def _assert_user( self ):
        pass

    def get_all_users( self ):
        pass

    def get_user( self, user_id ):
        pass

    def modify_user_account( self, user_id, first_name, last_name, occupatin, email ):
        pass

    def delete_user_accont( self, user_id ):
        pass

    def get_all_editors( self ):
        pass

    def add_editor( self, user_id ):
        pass

    def remove_editor( self, editor_id ):
        pass

    def get_requests( self ):
        pass

    def allow_request( self, request_id ):
        pass

    def deny_request( self, request_id ):
        pass

    def modify_station_data( self, **data ):
        pass

    def add_admin( self, user_id ):
        pass

    def remove_admin( self, admin_id ):
        pass

    def add_track( self, **track_data ):
        pass

    def edit_track( self, track_i
    def request_slot( self, **params ):
        pass

    def get_playlist( self, slot_id ):
        pass

    def set_playlist( self, slot_id, track_list ):
        pass

    def get_all_tracks( self ):
        pass

    def searh_tracks( self, **search_params ):
        pass

    def get_wishlist( self ):
        pass

    def get_active_users_count( self ):
        pass

    def get_active_admins_list( self ):
        pass

    def get_editor_preferred_tracks( self, editor_id ):
        pass


class Slot( BaseModel ):
    """Model of a single time slot assigned to an editor"""
    time            = DateTimeField( unique = True );
    editor          = ForeignKeyField( User )

    def get_slot_playlist( self ):
        pass

    def set_slot_playlist( self, track_list ):
        pass


class SlotRequest( BaseModel ):
    """Model of a request for allocating a time slot to the editor"""
    time            = TimeField();
    editor          = ForeignKeyField( User )
    days_bit_mask   = IntegerField()    # Bitmask
    start_date      = DateField()
    end_date        = DateField()

    def allow( self ):
        pass

    def deny( self ):
        pass


class PlaylistTrack( BaseModel ):
    """Model of a track on a slot playlist"""
    slot            = ForeignKeyField( Slot, related_name = "tracks" )
    track           = ForeignKeyField( Track )
    index           = IntegerField()
    play_duration   = IntegerField()

    class Meta:
        primary_key = CompositeKey( 'slot', 'track', 'index' )


class Wish( BaseModel ):
    """Model of a wishlist - all users' wishes"""
    track           = ForeignKeyField( Track )
    user            = ForeignKeyField( User )
    date_time       = DateTimeField()
    is_temporary    = BooleanField( default = True )

    @classmethod
    def get_user_wishlist( cls, user_id ):
        pass

    @classmethod
    def get_global_wishlist( cls ):
        pass

    def confirm( self ):
        pass


class RadioStaion( BaseModel ):
    """Radio station model - singleton table"""
    name            = CharField()
    oib             = CharField()
    address         = CharField()
    email           = CharField()
    frequency       = FloatField()

    @classmethod
    def modifiy_data( **data ):
        pass
