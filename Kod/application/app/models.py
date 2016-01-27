import peewee

from datetime import date, datetime, time, timedelta
from flask import render_template, request
from peewee import *

from app import app, db
from app.definitions import *
from app.helpers import *

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
    title           = CharField()
    path            = CharField()
    artist          = CharField()
    album           = CharField( null = True )
    duration        = IntegerField()
    file_format     = CharField( null = True )
    sample_rate     = FloatField( null = True )
    bits_per_sample = IntegerField( null = True )
    genre           = CharField( null = True )
    publisher       = CharField( null = True )
    carrier_type    = CharField( null = True )
    year            = IntegerField( null = True )

    @classmethod
    def add_track( cls, **track_data ):
        """Adds a new track; named attributes are passed to `track_data` dict"""
        track = cls.create( **track_data )
        track.save()
        return track

    @classmethod
    def edit_track( cls, track_id, **track_data ):
        """Edits track data, named attributed are passed to `track_data` dict

        Raises DoesNotExist
        """
        track = cls.get( Track.id == track_id )
        for attr, val in track_data.items():
            track.__setattr__( attr, val )
        track.save()
        return track

    @classmethod
    def delete_track( cls, track_id ):
        """Deletes a track with a given id"""
        cls.delete().where( Track.id == track_id ).execute()

    @classmethod
    def get_currently_playing( cls ):
        """Returns the currently playing track and the editor who selected it

        TODO: Bug fix!!!

        Raises DoesNotExist, IndexError
        """
        current_time = datetime.now()
        start_time = current_time.replace( minute = 0, second = 0, microsecond = 0 )
        print( current_time, start_time )

        slot = Slot.get( Slot.time == start_time )
        playlist = iter( slot.get_playlist().order_by( PlaylistTrack.index ) )
        ptrack = next( playlist )
        try:
            while True:
                print( start_time, ptrack.track.title )
                if start_time + timedelta( seconds = ptrack.play_duration ) > current_time:
                    print( ( current_time - start_time ).total_seconds() )
                    return ptrack, ( current_time - start_time ).total_seconds(), slot.editor
                start_time += timedelta( seconds = ptrack.play_duration )
                ptrack = next( playlist )
        except StopIteration:
            raise IndexError

    @classmethod
    def get_most_popular( cls ):
        """Returns a list of 5 most popular tracks

        Popularity is calculated as 3*number_of_times_played + 2*number_of_times_wished.
        """
        return ( Track.select( Track,
            ( fn.Count( fn.Distinct( PlaylistTrack.id ) )*3 + fn.Count( fn.Distinct( Wish.id ) )*2 ).alias( 'popularity') )
            .join( PlaylistTrack, JOIN.LEFT_OUTER ).switch( Track ).join( Wish, JOIN.LEFT_OUTER )
            .group_by( Track ).order_by( SQL( 'popularity DESC' ) ).limit( 5 ) )

    @classmethod
    def get_tracks( cls, start = 0, limit = None ):
        """Returns a list of all tracks

        Supports pagination.
        """
        query = cls.select().order_by( Track.title ).offset( start )
        if limit is not None: query = query.limit( limit )
        return query

    @classmethod
    def search_tracks( cls, term ):
        """Returns a list of tracks matching search parameters

        Search term must be at least 3 characters long.
        Results are ordered by relevance:
            - Title containing the term is worth 4 pts
            - Artist containing the term is worth 3 pts
            - Album containing the term is worth 2 pts
        Points are summed and tracks ordered by their scores.

        Raises ValueError
        """
        if len( term ) < 3:
            raise ValueError
        results = [ ( calc_track_score( track, term ), track ) for track in
            Track.select().where( Track.title.contains( term ) | Track.artist.contains( term ) | Track.album.contains( term ) ) ]
        results.sort( key = lambda x : x[ 0 ], reverse = True )
        return map( lambda x : x[ 1 ], results )

    def get_total_play_count( self ):
        """Returns a number of times this track was played"""
        return ( Track.select( Track, fn.Count( SQL( '*' ) ).alias( 'count' ) )
            .where( Track.id == self.id ).join( PlaylistTrack ).group_by( Track ).first().count )


class User( BaseModel ):
    """Model for all registered users

    Contains basic user info and some extra, app-specific data:
        - account_type      :: type of user account, can be USER, EDITOR, ADMIN, OWNER
        - last_active       :: date and time of last user activity (user is considered
                               active if last_active is within last 10 minutes )
        - activation_code   :: unique code generated from user_id, registration time,
                               and some random data, used for account activation via link
                               sent to email
        - activated         :: whether account is already activated
        - password_salt     :: a random string of characters added to the password before
                               hashing to prevent some types of malicious attacks

        NOTE: User password must contain only ASCII symbols (possibly relaxed in the future)
    """
    first_name      = CharField()
    last_name       = CharField()
    occupation      = CharField()
    year_of_birth   = IntegerField()
    email           = CharField( unique = True )
    password_hash   = CharField()
    password_salt   = CharField()
    account_type    = IntegerField( default = AccountType.USER )
    last_active     = DateTimeField( null = True )
    activated       = BooleanField( default = False )
    activation_code = CharField( null = True, unique = True )

    @classmethod
    def authenticate_user( cls, email, password ):
        """Attempts to authenticate a user with a given email and password

        Tests existance of user with a given email, password correctness and
        account status( activated or not ).

        Raises AuthenticationError, DoesNotExist
        """
        user = cls.get( User.email == email )
        user._authenticate( password )

        if not user.activated:
            raise AuthenticationError( 'Korisnički račun nije aktiviran' )
        return user

    @classmethod
    def create_user( cls, first_name, last_name, occupation, year_of_birth, email, password ):
        """Creates a new user and stores it into the database

        Sets basic user info given as arguments, as well as activation_code and
        last_active.

        Raises peewee.IntegrityError, DoesNotExist
        """
        salt = generate_random_string( 64 )
        user = cls( first_name = first_name, last_name = last_name, occupation = occupation,
            year_of_birth = year_of_birth, email = email, password_hash = hash_password( password, salt ), password_salt = salt )
        user.save()
        user.last_active = datetime.now()
        user.activation_code = generate_activation_code( user.id, user.last_active )

        user.save()
        return user

    @classmethod
    def delete_user( cls, user_id ):
        """Deletes a user with a given id

        Also deletes all user's slot requests, unconfirmed wishes and unfilled slots.

        Raises DoesNotExist
        """
        user = cls.get( User.id == user_id )
        SlotRequest.delete().where( SlotRequest.editor == user ).execute()
        Wish.delete().where( ( Wish.user == user ) & ( Wish.is_temporary == True ) ).execute()
        user.delete_instance()

    @classmethod
    def activate_user( cls, activation_code ):
        """Activates a user who has a given activation code

        Raises DoesNotExist
        """
        user = cls.get( User.activation_code == activation_code )
        if user.activated:
            raise ValueError( 'Korisnički račun je već aktivan')
        user.activated = True
        user.save()

    @classmethod
    def list_active_admins( cls ):
        """Returns a list of all the admins active within the last 10 minutes"""
        moment = datetime.now() - timedelta( seconds = 600 )
        return cls.select().where( ( User.account_type == AccountType.ADMINISTRATOR ) &
            ( User.last_active > moment ) ).order_by( User.last_name, User.first_name )

    @classmethod
    def count_active_users( cls ):
        """Returns a number of users active within the last 10 minutes"""
        moment = datetime.now() - timedelta( seconds = 600 )
        return cls.select().where( User.last_active > moment ).count()

    @classmethod
    def search_basic_users( cls, term ):
        """Returns a list of basic users containing `term` in their names

        Search term must be at least 2 characters long.
        Results are ordered by relevance:
            - Last_name containing the term is worth 3 pts
            - First_name containing the term is worth 2 pts
        Points are summed and users ordered by their scores.

        Raises ValueError
        """
        if len( term ) < 2:
            raise ValueError
        results = [ ( calc_user_score( user, term ), user ) for user in
            User.select().where( ( User.account_type == AccountType.USER ) &
            ( User.first_name.contains( term ) | User.last_name.contains( term ) ) ) ]
        results.sort( key = lambda x : x[ 0 ], reverse = True )
        return map( lambda x : x[ 1 ], results )

    def change_password( self, old_password, new_password ):
        """Changes account password

        First checks to see if old_password matches the existing password.

        Raises AuthenticationError
        """
        self._authenticate( old_password )

        self.password_hash = hash_password( new_password, self.password_salt )
        self.save()

    def modify_account( self, first_name = None, last_name = None, occupation = None,
        year_of_birth = None, email = None ):
        """Changes user account data

        Raises peewee.IntegrityError
        """
        if first_name is not None: self.first_name = first_name
        if last_name is not None: self.last_name = last_name
        if occupation is not None: self.occupation = occupation
        if year_of_birth is not None: self.year_of_birth = year_of_birth
        if email is not None: self.email = email
        self.save()

    def delete_account( self, password ):
        """Deletes user account

        First checks to see if account password is equal to the given one.

        Raises AuthenticationError
        """
        self._authenticate( password )

        User.delete_user( self.id )

    def update_activity( self ):
        """Sets last_active field to now"""
        self.last_active = datetime.now()
        self.save()

    def _authenticate( self, password ):
        """Checks whether a given password matches the account one

        Raises AuthenticationError
        """
        if self.password_hash != hash_password( password, self.password_salt ):
            raise AuthenticationError( 'Neispravna lozinka.' )

    def _assert_admin( self ):
        """Checks whether user is an administrator

        Raises AuthorizationError
        """
        if self.account_type != AccountType.ADMINISTRATOR:
            raise AuthorizationError( 'Korisnik nije administrator.' )

    def _assert_editor( self ):
        """Checks whether user is an editor

        Raises AuthorizationError
        """
        if self.account_type != AccountType.EDITOR:
            raise AuthorizationError( 'Korisnik nije urednik.' )

    def _assert_owner( self ):
        """Checks whether user is an owner

        Raises AuthorizationError
        """
        if self.account_type != AccountType.OWNER:
            raise AuthorizationError( 'Korisnik nije vlasnik.' )

    def _assert_user( self ):
        """Checks whether user is a basic user

        Raises AuthorizationError
        """
        if self.account_type != AccountType.USER:
            raise AuthorizationError( 'Korisnik nije obični korisnik' )

    def get_all_users( self ):
        """Returns a list of all users and editors( admins and owner are excluded )

        Operation restricted to administrators.

        Raises AuthorizationError
        """
        try:
            self._assert_admin()
        except AuthorizationError:
            self._assert_owner()
        return User.select().where( User.account_type << [ AccountType.USER, AccountType.EDITOR ] )

    def get_user( self, user_id ):
        """Returns account data of a user with a given id

        User whose data is returned has to be either editor or basic user.
        Operation restricted to administrators.

        Raises AuthorizationError, DoesNotExist
        """
        self._assert_admin()
        user = User.get( User.id == user_id )
        if user.account_type not in [ AccountType.USER, AccountType.EDITOR ]:
            raise AuthorizationError( 'Nije dozvoljeno pristupiti podacima ovog korisnika.' )
        return user

    def modify_user_account( self, user_id, first_name = None, last_name = None,
        occupation = None, year_of_birth = None, email = None ):
        """Modifies account data of a user with a given id

        User whose data is modified has to be either editor or basic user.
        Operation restricted to administrators.

        Raises AuthorizationError, DoesNotExist, peewee.IntegrityError
        """
        self._assert_admin()
        user = User.get( User.id == user_id )
        if user.account_type not in [ AccountType.USER, AccountType.EDITOR ]:
            raise AuthorizationError( 'Nije dozvoljeno mijenjati podactke ovog korisnika.' )
        user.modify_account( first_name, last_name, occupation, year_of_birth, email )

    def delete_user_account( self, user_id ):
        """Deletes user account with a given id

        User whose account is deleted has to be either editor or basic user.
        Operation restricted to administrators.

        Raises AuthorizationError, DoesNotExist
        """
        self._assert_admin()
        user = User.get( User.id == user_id )
        if user.account_type not in [ AccountType.USER, AccountType.EDITOR ]:
            raise AuthorizationError( 'Nije dozvoljeno mijenjati podactke ovog korisnika.' )
        User.delete_user( user.id )

    def get_all_editors( self ):
        """Returns a list of all editors

        Operation restricted to administrators.

        Raises AuthorizationError
        """
        self._assert_admin()
        return User.select().where( User.account_type == AccountType.EDITOR )

    def add_editor( self, user_id ):
        """Makes user with a given id an editor

        User to be made editor has to be a basic user.
        Operation restricted to administrators.

        Raises AuthorizationError, TypeError, DoesNotExist
        """
        self._assert_admin()
        user = User.get( User.id == user_id )
        if user.account_type != AccountType.USER:
            raise TypeError( 'Korisnika nije moguće postaviti za urednika, već ima neku ulogu.' )
        user.account_type = AccountType.EDITOR
        user.save()

    def remove_editor( self, editor_id ):
        """Makes editor with a given id a basic user (revokes editorial privileges)

        User has to be an editor.
        Operation restricted to administrators.

        Raises AuthorizationError, TypeError, DoesNotExist
        """
        self._assert_admin()
        editor = User.get( User.id == editor_id )
        if editor.account_type != AccountType.EDITOR:
            raise TypeError( 'Korisniku nije mu moguće oduzeti uredničke ovlasti jer nije urednik.' )
        editor.account_type = AccountType.USER
        editor.save()

    def get_requests( self ):
        """Returns a list of all editor's slot pending requests

        Operation restricted to editors.

        Raises AuthorizationError
        """
        self._assert_editor()
        return SlotRequest.select().where( SlotRequest.editor == self ).join( User )

    def get_all_requests( self ):
        """Returns a list of all slot pending requests

        Operation restricted to administrators.

        Raises AuthorizationError
        """
        self._assert_admin()
        return SlotRequest.select().join( User )

    def allow_request( self, request_id ):
        """Allows requested slot allocation

        Operation restricted to administrators.

        Raises AuthorizationError, DoesNotExist
        """
        self._assert_admin()
        request = SlotRequest.get( SlotRequest.id == request_id )
        request.allow()

    def deny_request( self, request_id ):
        """Denies requested slot allocation

        Operation restricted to administrators.

        Raises AuthorizationError, DoesNotExist
        """
        self._assert_admin()
        request = SlotRequest.get( SlotRequest.id == request_id )
        request.deny()

    def modify_station_data( self, name = None, description = None, oib = None, address = None, email = None, frequency = None ):
        """Modifies radio station data

        Operation restricted to owner.

        Raises AuthorizationError
        """
        self._assert_owner()
        RadioStation.modifiy_data( name, description, oib, address, email, frequency )

    def get_all_admins( self ):
        """Returns a list of all admins

        Operation restricted to the owner.

        Raises AuthorizationError
        """
        self._assert_owner()
        return User.select().where( User.account_type == AccountType.ADMINISTRATOR )

    def add_admin( self, user_id ):
        """Makes user with a given id an administrator

        User to be made admin has to be a basic user.
        Operation restricted to owners.

        Raises AuthorizationError, TypeError, DoesNotExist, ValueError
        """
        self._assert_owner()
        if User.select().where( User.account_type == AccountType.ADMINISTRATOR ).count() > 9:
            raise ValueError
        user = User.get( User.id == user_id )
        if user.account_type != AccountType.USER:
            raise TypeError( 'Korisnika nije moguće postaviti za administratora, već ima neku ulogu.' )
        user.account_type = AccountType.ADMINISTRATOR
        user.save()

    def remove_admin( self, admin_id ):
        """Makes administrator with a given id a basic user (revokes administrative privileges)

        User has to be an administrator.
        Operation restricted to owners.

        Raises AuthorizationError, TypeError, DoesNotExist
        """
        self._assert_owner()
        admin = User.get( User.id == admin_id )
        if admin.account_type != AccountType.ADMINISTRATOR:
            raise TypeError( 'Korisniku nije moguće oduzeti administratorske ovlasti jer nije administrator.' )
        admin.account_type = AccountType.USER
        admin.save()

    def add_track( self, **track_data ):
        """Adds a new track into system

        Operation restricted to administrators.

        Raises AuthorizationError
        """
        self._assert_admin()
        Track.add_track( **track_data )

    def get_track( self, track_id ):
        """Returns track data

        Operation restricted to administrators.

        Raises AuthorizationError, DoesNotExist
        """
        self._assert_admin()
        return Track.get( Track.id == track_id )

    def edit_track( self, track_id , **track_data ):
        """Edits track data

        Operation restricted to administrators.

        Raises AuthorizationError, DoesNotExist
        """
        self._assert_admin()
        Track.edit_track( track_id, **track_data )

    def remove_track( self, track_id ):
        """Removes a track from the system

        Operation restricted to administrators.

        Raises AuthorizationError, DoesNotExist
        """
        self._assert_admin()
        Track.delete_track( track_id )

    def get_slots( self ):
        """Returns a list of future slots allocated to the editor

        Operation restricted to editors.

        Raises AuthorizationError
        """
        self._assert_editor()
        return ( Slot.select( Slot, fn.Count( PlaylistTrack.id ).alias( 'count' ) )
            .where( ( Slot.editor == self ) & ( Slot.time > datetime.now() - timedelta(days = 7) ) )
            .join( PlaylistTrack, JOIN.LEFT_OUTER ).group_by( Slot ) )

    def get_reserved_slots( self ):
        """Returns a list of reserved future slots

        Operation restricted to editors.

        Raises AuthorizationError
        """
        self._assert_editor()
        return Slot.select().where( Slot.time > datetime.now() - timedelta(days = 7) )

    def get_all_slots( self ):
        """Returns a list of all future slots allocated to anyone

        Operation restricted to admins.

        Raises AuthorizationError
        """
        self._assert_admin()
        return Slot.get_slots()

    def request_slot( self, time, days_bit_mask, start_date, end_date ):
        """Request a new time slot

        Request is for one-hour slots starting at `time`, on the days encoded in
        `days_bit_mask`, from `start_date` to `end_date`.
        Operation restricted to editors.

        Raises AuthorizationError
        """
        self._assert_editor()
        SlotRequest.make_request( time, days_bit_mask, start_date, end_date, self )

    def get_slot_playlist( self, slot_id ):
        """Returns stored playlist for a given slot

        Operation restricted to editors.

        Raises AuthorizationError, DoesNotExist
        """
        self._assert_editor()
        slot = Slot.get( Slot.id == slot_id )
        if slot.editor != self:
            raise AuthorizationError( 'Nije dozvoljeno pregledavati liste drugih urednika.' )
        return slot.get_playlist()

    def set_slot_playlist( self, slot_id, track_list ):
        """Sets playlist for a given slot

        Track list consists of triplets (index, track_id, duration).
        Operation restricted to editors.

        Raises AuthorizationError, DoesNotExist
        """
        self._assert_editor()
        slot = Slot.get( Slot.id == slot_id )
        if slot.editor != self:
            raise AuthorizationError( 'Nije dozvoljeno mijenjati liste drugih urednika.' )
        slot.set_playlist( track_list )

    def get_all_tracks( self, start = 0, limit = None ):
        """Returns a list of all tracks"""
        return Track.get_tracks( start, limit )

    def search_tracks( self, term ):
        """Returns a list of all tracks containing `term` in its metadata"""
        return Track.search_tracks( term )

    def get_wishlist( self ):
        """Returns user's wishlist

        Restricted to basic users.

        Raises AuthorizationError
        """
        self._assert_user()
        return Wish.get_user_wishlist( self )

    def get_wishlist_confirmation_time( self ):
        """Return last time user confirmed his wishlist

        Restricted to basic users.

        Raises AuthorizationError
        """
        self._assert_user()
        last_confirmed_wish = ( Wish.select().where( ( Wish.user == self ) &
            ( Wish.is_temporary == False ) ).order_by( Wish.date_time.desc() ).first() )
        return last_confirmed_wish.date_time if last_confirmed_wish is not None else None

    def set_wishlist( self, track_list ):
        """Sets user's wishlist

        Track list contains up to ten track ids.
        Restricted to basic users.

        Raises AuthorizationError, DoesNotExist, ValueError
        """
        self._assert_user()
        if len( track_list ) > 10:
            raise ValueError( 'Previše zapisa na listi želja.' )
        Wish.set_user_wishlist( self, track_list )

    def confirm_wishlist( self ):
        """Confirms user's temporary wishlist

        Restricted to basic users.

        Raises AuthorizationError
        """
        self._assert_user()
        Wish.confirm_user_wishlist( self )

    def get_global_wishlist( self ):
        """Returns the global wishlist

        Basic users cannot perform this action.

        Raises AuthorizationError
        """
        if self.account_type < AccountType.EDITOR:
            raise AuthorizationError( 'Pregled globalne liste želja nije dozvoljen.' )
        return Wish.get_global_wishlist()

    def get_total_track_play_count_stat( self, track_id ):
        """Return total play count for a given track

        Restricted to administrators.

        Raises AuthorizationError, DoesNotExist
        """
        self._assert_admin()
        track = Track.get( Track.id == track_id )
        return track.get_total_play_count()

    def get_most_wished_track( self ):
        """Return the most wished track

        Restricted to administrators.

        Raises AuthorizationError, DoesNotExist
        """
        self._assert_admin()
        track = Wish.get_global_wishlist().first().track
        return track

    def get_most_wished_track_stat( self, start_date, end_date ):
        """Return number of times the most wished track was played between two dates

        Restricted to administrators.

        Raises AuthorizationError, DoesNotExist
        """
        track = self.get_most_wished_track()
        return Wish.select( fn.Count( Wish.id ) ).where( ( Wish.track == track )
            & ( Wish.is_temporary == False ) & ( Wish.date_time.between( start_date, end_date ) ) ).scalar()

    def get_active_users_count_stat( self ):
        """Returns a number of currently active users

        Restricted to administrators and owner.

        Raises AuthorizationError
        """
        if self.account_type < AccountType.ADMINISTRATOR:
            raise AuthorizationError( 'Dohvaćanje broja trenutnih korisnika nije dozvoljeno.' )
        return User.count_active_users()

    def get_active_admins_list_stat( self ):
        """Returns a list of active administrators

        Restricted to administrators and owner.

        Raises AuthorizationError
        """
        if self.account_type < AccountType.ADMINISTRATOR:
            raise AuthorizationError( 'Pregled trenutno aktivnih administratora nije dozvoljen.' )
        return User.list_active_admins()

    def get_editor_preferred_tracks_stat( self, editor_id ):
        """Returns a list of tracks most often played by this editor

        Restricted to administrators.

        Raises AuthorizationError, TypeError, DoesNotExist
        """
        self._assert_admin()
        editor = User.get( User.id == editor_id )
        if editor.account_type != AccountType.EDITOR:
            raise TypeError( 'Odabrani korisnik nije urednik' )
        return PlaylistTrack.get_editor_preferred_tracks( editor_id )

    def search_users( self, term ):
        """Get a list of (basic) users containing `term` in their names

        Raises AuthorizationError
        """
        if self.account_type < AccountType.ADMINISTRATOR:
            raise AuthorizationError( 'Pretraživanje popisa korisnika nije dozvoljeno' )
        return User.search_basic_users( term )


class Slot( BaseModel ):
    """Model of a single time slot assigned to an editor"""
    time            = DateTimeField( unique = True );
    editor          = ForeignKeyField( User, related_name = 'assigned_slots' )

    @classmethod
    def get_slots( cls ):
        """Returns a list of all future assigned slots"""
        return ( cls.select( Slot, fn.Count( PlaylistTrack.id ).alias( 'count' ) )
            .where( Slot.time > datetime.now() )
            .join( PlaylistTrack, JOIN.LEFT_OUTER ).switch( Slot ).join( User ).group_by( Slot ) )

    @classmethod
    def get_next_on_schedule( cls ):
        """Returns a list of the current and next six slots on the schedule"""
        return cls.select().where( Slot.time > datetime.now() - timedelta( hours = 1 ) ).order_by( Slot.time.asc() ).join( User ).limit( 7 )

    def get_playlist( self ):
        """Returns all tracks set to be played in a given slot

        Tracks are returned with extra data: index and play duration.
        """
        return PlaylistTrack.select().where( PlaylistTrack.slot == self ).join( Track )

    def set_playlist( self, track_list ):
        """Makes a playlist for a given slot

        Track list consists of triplets (index, track_id, duration).
        """
        PlaylistTrack.delete().where( PlaylistTrack.slot == self ).execute()
        data = [ { 'slot' : self, 'track' : Track.get( Track.id == t_id ), 'index' : i, 'play_duration' : d }
            for i, t_id, d in track_list ]
        PlaylistTrack.insert_many( data ).execute()


class SlotRequest( BaseModel ):
    """Model of a request for allocating a time slot to the editor"""
    time            = TimeField();
    editor          = ForeignKeyField( User, related_name = 'slot_requests' )
    days_bit_mask   = IntegerField()
    start_date      = DateField()
    end_date        = DateField()

    @classmethod
    def make_request( cls, time, days_bit_mask, start_date, end_date, editor ):
        """ """
        request = cls( time = time, editor = editor, days_bit_mask = days_bit_mask,
            start_date = start_date, end_date = end_date )
        request.save()

    def allow( self ):
        """Allow a slot request

        Raises peewee.IntegrityError
        """
        if self.detect_collisions(): raise peewee.IntegrityError
        times = generate_times( self.time, self.days_bit_mask, self.start_date, self.end_date )
        data = [ { 'time' : t, 'editor' : self.editor } for t in times ]
        Slot.insert_many( data ).execute()
        self.delete_instance()

    def deny( self ):
        """Denies slot request by removing it from the database"""
        self.delete_instance()

    def detect_collisions( self ):
        """Checks whether this request collides with any assigned slots"""
        times = generate_times( self.time, self.days_bit_mask, self.start_date, self.end_date )
        return Slot.select().where( Slot.time << times ).count() > 0

class PlaylistTrack( BaseModel ):
    """Model of a track on a slot playlist"""
    slot            = ForeignKeyField( Slot, related_name = "tracks" )
    track           = ForeignKeyField( Track )
    index           = IntegerField()
    play_duration        = IntegerField()

    @classmethod
    def get_editor_preferred_tracks( cls, editor_id ):
        """Return a list of tracks most often played by this editor"""
        editor = User.get( User.id == editor_id )
        return ( PlaylistTrack.select( Track, fn.Count( PlaylistTrack.id ).alias( 'count' ) )
            .join( Slot ).where( Slot.editor == editor ).switch( PlaylistTrack )
            .join( Track ).group_by( Track ).order_by( 'count DESC' ) )


class Wish( BaseModel ):
    """Model of a wishlist - all users' wishes"""
    track           = ForeignKeyField( Track, related_name = 'wishes' )
    user            = ForeignKeyField( User, related_name = 'wishes' )
    date_time       = DateTimeField()
    is_temporary    = BooleanField( default = True )

    @classmethod
    def get_user_wishlist( cls, user ):
        """Return a list of all user's currently active wishes

        A wish is currently active if it is temporary.
        """
        return cls.select().where( ( Wish.user == user ) & ( Wish.is_temporary == True ) ).join( Track )

    @classmethod
    def set_user_wishlist( cls, user, track_list ):
        """Set user's wishlist

        Track list contains up to 10 track ids.
        """
        cls.delete().where( ( Wish.user == user ) & ( Wish.is_temporary == True ) ).execute()
        time_now = datetime.now()
        data = [ { 'track' : Track.get( Track.id == track_id ), 'user' : user, 'date_time' : time_now }
            for track_id in track_list ]
        cls.insert_many( data ).execute()

    @classmethod
    def confirm_user_wishlist( cls, user ):
        """Confirm wishes from user's wishlist

        Equivalent to making all those wishes permanent (not temporary).
        Has to check that user hasn't already confirmed any wishlist within last 24 hours.

        Raises AuthorizationError, EnvironmentError"""
        time_now = datetime.now()

        last_confirmed_wish = ( Wish.select().where( ( Wish.user == user ) &
            ( Wish.is_temporary == False ) ).order_by( Wish.date_time.desc() ).first() )
        if last_confirmed_wish is not None and last_confirmed_wish.date_time > time_now - timedelta( days = 1 ):
            raise EnvironmentError
        ( Wish.update( is_temporary = False, date_time = time_now )
            .where( ( Wish.user == user ) & ( Wish.is_temporary == True ) ).execute() )


    @classmethod
    def get_global_wishlist( cls, start = 0, limit = None ):
        """Returns a list of all tracks on wishlists, with occurrence count"""
        return ( Wish.select( Wish, fn.Count( Wish.id ).alias( 'count' ) )
            .where( Wish.is_temporary == False ).join( Track ).group_by( Track )
            .order_by( SQL( 'count' ).desc() ) )


class RadioStation( BaseModel ):
    """Radio station model - singleton table"""
    name            = CharField()
    description     = TextField()
    oib             = CharField()
    address         = CharField()
    email           = CharField()
    frequency       = FloatField()

    class Meta:
        primary_key = False

    @classmethod
    def modifiy_data( cls, name = None, description = None, oib = None, address = None, email = None, frequency = None ):
        """Modify radio station data"""
        station = cls.get()
        if name is not None: station.name = name
        if description is not None: station.description = description
        if oib is not None: station.oib = oib
        if address is not None: station.address = address
        if email is not None: station.email = email
        if frequency is not None: station.frequency = frequency
        RadioStation.update( name = station.name, description = station.description,
            oib = station.oib, address = station.address, email = station.email,
            frequency = station.frequency ).execute()
