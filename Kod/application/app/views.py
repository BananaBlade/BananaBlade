import os

from flask import g, redirect, request, render_template, send_file, session
from peewee import DoesNotExist
from werkzeug import secure_filename

from app import app
from app.decorators import *
from app.helpers import *
from app.models import *
from app.validators import CharValidator, EmailValidator

# Various todos:
#       TODO: Check track path on input for possible malicious attacks
#       TODO: Setup cache to enable proper signing out (otherwise user could remain
#             signed in for a while)
#       TODO: Rethink index and settings pages - possibly combine them into one
#       TODO: Reformulate error messages - decide upon unique format


# Pre-request setup

@app.before_request
def preprocess_request():
    """Before processing each request, make the current user available to everyone via flask g object,
    and store activity time"""
    g.user = User.get( User.id == int( session[ 'user_id' ] ) ) if 'user_id' in session else None
    if g.user is not None: g.user.update_activity()


# Display routes

@app.route( '/' )
def show_index():
    """Displays the index page"""
    # TODO: Implement
    return 'Index'

@app.route( '/settings' )
@login_required
def show_settings():
    """Displays the settings page - where frontend app is located"""
    # TODO: Implement
    return 'Settings'


# Play routes

@app.route( '/player/get', methods = [ 'GET' ] )
def get_currently_playing_track():
    """Returns currently playing track as a file

    No request parameters required.
    """
    try:
        track = Track.get_currently_playing()
        return send_file( track.path )
    except DoesNotExist:
        return error_response( 'Nije moguće dohvatiti trenutno svirani zapis', 404 )

@app.route( '/player/info', methods = [ 'GET' ] )
def get_currently_playing_track_info():
    """Returns informations about the currently playing track

    No request parameters required.
    """
    try:
        track = Track.get_currently_playing()
        data = {
            'id'                : track.id,
            'title'             : track.title,
            'artist'            : track.artist,
            'album'             : track.album,
            'duration'          : track.duration,
            'file_format'       : track.file_format,
            'sample_rate'       : track.sample_rate,
            'bits_per_sample'   : track.bits_per_sample,
            'genre'             : track.genre,
            'publisher'         : track.publisher,
            'carrier_type'      : track.carrier_type,
            'year'              : track.year
        }
        return data_response( data )
    except DoesNotExist:
        return error_response( 'Nije moguće dohvatiti trenutno svirani zapis', 404 )


# User auth

@app.route( '/user/auth/login', methods = [ 'POST' ] )
def process_login():
    """Process user login

    Request should contain `email` and `password_hash` arguments.
    """
    email           = request.values.get( 'email' )
    password_hash   = request.values.get( 'password_hash' )

    try:
        EmailValidator().validate( email )
        user = User.authenticate_user( email, password_hash )
        session[ 'user_id' ] = user.id
        return success_response( 'Uspješna prijava' )
    except ValueError:
        return error_response( 'Email adresa nije ispravna' )
    except DoesNotExist:
        return error_response( 'Ne postoji korisnik s danom email adresom', 404 )
    except AuthenticationError as e:
        return error_response( str( e ) )

@app.route( '/user/auth/register', methods = [ 'POST' ] )
def process_registration():
    """Process user registration

    Request should contain `first_name`, `last_name`, `email`, `occupation`,
    `year_of_birth` and `password_hash` arguments.
    """
    first_name      = request.values.get( 'first_name' )
    last_name       = request.values.get( 'last_name' )
    email           = request.values.get( 'email' )
    occupation      = request.values.get( 'occupation' )
    year_of_birth   = int( request.values.get( 'year_of_birth' ) )
    password_hash   = request.values.get( 'password_hash' )

    try:
        validate_user_data( first_name, last_name, email, year_of_birth, occupation,
            password_hash = password_hash )
        user = User.create_user( first_name, last_name, occupation, email, password_hash )
        # TODO: Send email with the activation code
        return success_response( 'Registracija uspješna', 201 )
    except ValueError:
        return error_response( 'Uneseni su neispravni podaci' )
    except peewee.IntegrityError:
        return error_response( 'Već postoji korisnik s danom email adresom', 409 )

@app.route( '/user/auth/activate/<activation_code>', methods = [ 'GET' ] )
def process_activation( activation_code ):
    """Process account activation

    No request parameters required, `activation_code` obtained from the URL

    TODO: Style the response page
    """
    try:
        User.activate_user( activation_code )
        return 'Račun aktiviran'
    except DoesNotExist:
        return 'Ne postoji korisnik s danim aktivacijskim kodom', 400

@app.route( '/user/auth/signout', methods = [ 'GET' ] )
@login_required
def process_signout():
    """Process user signout

    No request parameters required.
    After signing out, user is redirected to the index page.
    """
    session.clear()
    return redirect( '/' )


# User account management

@app.route( '/user/account/get', methods = [ 'GET' ] )
@login_required
def get_account_data():
    """Return user account data

    No request parameters required.
    """
    data = {
        'id'            :   g.user.id,
        'first_name'    :   g.user.first_name,
        'last_name'     :   g.user.last_name,
        'email'         :   g.user.email,
        'year_of_birth' :   g.user.year_of_birth,
        'occupation'    :   g.user.occupation
    }
    return data_response( data )

@app.route( '/user/account/modify', methods = [ 'POST' ] )
@login_required
def modify_account_data():
    """Change user account data

    Request should contain `first_name`, `last_name`, `email`, `occupation` and
    `year_of_birth`.
    """
    first_name      = request.values.get( 'first_name' )
    last_name       = request.values.get( 'last_name' )
    email           = request.values.get( 'email' )
    year_of_birth   = int( request.values.get( 'year_of_birth' ) )
    occupation      = request.values.get( 'occupation' )

    try:
        validate_user_data( first_name, last_name, email, year_of_birth, occupation )
        g.user.modify_account( first_name, last_name, email, year_of_birth, occupation )
        return success_response( 'Korisnički podaci uspješno promjenjeni' )
    except ValueError:
        return error_response( 'Nisu uneseni ispravni podaci' )
    except peewee.IntegrityError:
        return error_response( 'Email adresa se već koristi', 409 )

@app.route( '/user/account/delete', methods = [ 'POST' ] )
@login_required
def delete_account():
    """Deletes current user's account

    Request should contain `password_hash`.
    """
    password_hash = request.values.get( 'password_hash' )

    try:
        g.user.delete_account( password_hash )
        session.clear()
        return success_response( 'Korisnički račun uspješno izbrisan' )
    except AuthenticationError:
        return error_response( 'Nije unesena ispravna lozinka' )

@app.route( '/user/account/change_password', methods = [ 'POST' ] )
@login_required
def change_account_password():
    """Changes user account password

    Request should contain `old_password_hash` and `new_password_hash`.
    """
    old_password_hash = request.values.get( 'old_password_hash' )
    new_password_hash = request.values.get( 'new_password_hash' )

    try:
        g.user.change_password( old_password_hash, new_password_hash )
        return success_response( 'Lozinka uspješno promjenjena' )
    except AuthenticationError:
        return error_response( 'Stara lozinka nije ispravna' )


# User wishlist management

@app.route( '/user/wishlist/get', methods = [ 'GET' ] )
@login_required
def get_wishlist():
    """Returns user's private wishlist

    Returns a list of up to 10 dicts { id, title, artist, album, duration, genre, year }
    describing tracks on user's wishlist.

    No request parameters required.
    """
    try:
        wishlist = g.user.get_wishlist()
        data = [{
            'id'        : wish.id,
            'title'     : wish.track.title,
            'artist'    : wish.track.artist,
            'album'     : wish.track.album,
            'duration'  : wish.track.duration,
            'genre'     : wish.track.genre,
            'year'      : wish.track.year
        } for wish in wishlist ]
        return data_response( data )
    except AuthorizationError:
        return error_response( 'Korisnik nema mogućnost pregledavanja svoje liste želja', 403 )

@app.route( '/user/wishlist/set', methods = [ 'POST' ] )
@login_required
def set_wishlist():
    """Sets user's wishlist

    Request should contain a list of up to 10 track_id's, of tracks to be placed
    on the user's wishlist. Parameters are JSON-encoded.
    """
    try:
        track_list = request.get_json()
        g.user.set_wishlist( track_list )
        return success_response( 'Lista želja uspješno pohranjena', 201 )
    except AuthorizationError:
        return error_response( 'Korisnik nema mogućnost stvaranja svoje liste želja', 403 )

@app.route( '/user/wishlist/confirm', methods = [ 'POST' ] )
@login_required
def confirm_wishlist():
    """Confirms user's wishlist

    No request parameters required.
    """
    try:
        g.user.confirm_wishlist()
        return success_response( 'Lista želja uspješno potvrđena' )
    except AuthorizationError:
        return error_response( 'Korisnik nema mogućnost potvrđivanja svoje liste želja', 403 )
    except EnvironmentError:
        return error_response( 'Nije moguće potvrditi listu želja, to je već učinjeno unutar proteklih 24 sata', 409 )


# Admin track management

@app.route( '/admin/tracks/add', methods = [ 'POST' ] )
@login_required
def add_track():
    """Adds a new track with its metadata

    Request should contain track metadata: `title`, `artist`, `album`, `duration`,
    `file_format`, `sample_rate`, `bits_per_sample`, `genre`, `publisher`,
    `carrier_type`, `year`, and audio file for upload.

    TODO: Extensive testing!!
    """
    title           = request.values.get( 'title' )
    artist          = request.values.get( 'artist' )
    album           = request.values.get( 'album' )
    duration        = int( request.values.get( 'duration' ) )
    file_format     = request.values.get( 'file_format' )
    sample_rate     = float( request.values.get( 'sample_rate' ) )
    bits_per_sample = int( request.values.get( 'bits_per_sample' ) )
    genre           = request.values.get( 'genre' )
    publisher       = request.values.get( 'publisher' )
    carrier_type    = request.values.get( 'carrier_type' )
    year            = int( request.values.get( 'year' ) )
    audio_file      = request.files.get( 'audio_file' )

    try:
        validate_track_data( title, artist, album, duration, file_format, sample_rate,
            bits_per_sample, genre, publisher, carrier_type, year )
        if audio_file is None: raise ValueError

        validate_filename( audio_file.filename )
        filename = secure_filename( audio_file.filename )
        path = os.path.join( app.config['UPLOAD_FOLDER'], filename )

        g.user.add_track( title = title, path = path, artist = artist, album = album, duration = duration,
            file_format = file_format, sample_rate = sample_rate, bits_per_sample = bits_per_sample,
            genre = genre, publisher = publisher, carrier_type = carrier_type, year = year )
        audio_file.save( path )
        return success_response( 'Zvučni zapis uspješno dodan', 201 )
    except AuthorizationError:
        return error_response( 'Korisnik nema ovlasti dodavati zvučne zapise', 403 )
    except ValueError:
        return error_response( 'Nisu uneseni ispravni podaci' )


@app.route( '/admin/tracks/<int:track_id>/edit', methods = [ 'POST' ] )
@login_required
def edit_track( track_id ):
    """Adds a new track with its metadata

    Request should contain track metadata: `title`, `artist`, `album`, `duration`,
    `file_format`, `sample_rate`, `bits_per_sample`, `genre`, `publisher`,
    `carrier_type`, `year`
    """
    title           = request.values.get( 'title' )
    artist          = request.values.get( 'artist' )
    album           = request.values.get( 'album' )
    duration        = int( request.values.get( 'duration' ) )
    file_format     = request.values.get( 'file_format' )
    sample_rate     = float( request.values.get( 'sample_rate' ) )
    bits_per_sample = int( request.values.get( 'bits_per_sample' ) )
    genre           = request.values.get( 'genre' )
    publisher       = request.values.get( 'publisher' )
    carrier_type    = request.values.get( 'carrier_type' )
    year            = int( request.values.get( 'year' ) )

    try:
        validate_track_data( title, artist, album, duration, file_format, sample_rate,
            bits_per_sample, genre, publisher, carrier_type, year )
        g.user.edit_track( track_id, title = title, artist = artist, album = album, duration = duration,
            file_format = file_format, sample_rate = sample_rate, bits_per_sample = bits_per_sample,
            genre = genre, publisher = publisher, carrier_type = carrier_type, year = year )
        return success_response( 'Podaci o zvučnom zapisu uspješno promjenjeni' )
    except AuthorizationError:
        return error_response( 'Korisnik nema ovlasti dodavati zvučne zapise', 403 )
    except DoesNotExist:
        return error_response( 'Ne postoji zvučni zapis s danim id-om', 404 )
    except ValueError:
        return error_response( 'Nisu uneseni ispravni podaci' )

@app.route( '/admin/tracks/<int:track_id>/delete', methods = [ 'POST' ] )
@login_required
def delete_track( track_id ):
    """Deletes track and its metadata

    No request parameters required.
    """
    try:
        path = Track.get( Track.id == track_id )
        os.remove( path )
        g.user.remove_track( track_id )
        return success_response( 'Zvučni zapis uspješno izbrisan' )
    except AuthorizationError:
        return error_response( 'Korisnik nema ovlasti brisati zvučne zapise', 403 )
    except DoesNotExist:
        return error_response( 'Ne postoji zvučni zapis s danim id-om', 404 )
    except OSError:
        return error_response( 'Greška u sustavu' )


# Admin editors management

@app.route( '/admin/editors/list', methods = [ 'GET' ] )
@login_required
def list_editors():
    """Returns a list of all editors

    Returns a list of dicts { id, first_name, last_name, email } representing
    individual editors.
    No request parameters required.
    """
    try:
        editors = g.user.get_all_editors()
        data = [{
            'id'            : editor.id,
            'first_name'    : editor.first_name,
            'last_name'     : editor.last_name,
            'email'         : editor.email
        } for editor in editors ]
        return data_response( data )
    except AuthorizationError:
        return error_response( 'Nije dozvoljeno dohvatiti popis urednika' )

@app.route( '/admin/editors/add/<int:user_id>', methods = [ 'POST' ] )
@login_required
def add_editor( user_id ):
    """Adds editorial privileges to user with `user_id`

    No request parameters required.
    """
    try:
        g.user.add_editor( user_id )
        return success_response( 'Korisnik uspješno postavljen za urednika' )
    except AuthorizationError:
        return error_response( 'Korisnik nema ovlasti postavljanja urednika', 403 )
    except DoesNotExist:
        return error_response( 'Ne postoji korisnik s danim id-om', 404 )
    except TypeError as e:
        return error_response( str( e ) )

@app.route( '/admin/editors/<int:editor_id>/remove', methods = [ 'POST' ] )
@login_required
def remove_editor( editor_id ):
    """Revokes editorial privileges from user with `user_id`

    No request parameters required.
    """
    try:
        g.user.remove_editor( user_id )
        return success_response( 'Korisniku uspješno oduzete uredničke ovlasti' )
    except AuthorizationError:
        return error_response( 'Korisnik nema ovlasti za uklanjane urednika', 403 )
    except DoesNotExist:
        return error_response( 'Ne postoji korisnik s danim id-om', 404 )
    except TypeError as e:
        return error_response( str( e ) )


# Admin requests management

@app.route( '/admin/requests/list', methods = [ 'GET' ] )
@login_required
def list_requests():
    """Returns a list of all pending slot requests

    Returns a list of dicts { editor : { id, first_name, last_name, email },
        request : { id, time, days_bit_mask, start_date, end_date } }.

    No request parameters required.
    """
    try:
        requests = g.user.get_all_requests()
        data = [{
            'editor' : {
                'id'            : req.editor.id,
                'first_name'    : req.editor.first_name,
                'last_name'     : req.editor.last_name,
                'email'         : req.editor.email
            },
            'request' : {
                'id'            : req.id,
                'time'          : req.time,
                'days_bit_mask' : req.days_bit_mask,
                'start_date'    : req.start_date,
                'end_date'      : req.end_date
            }
        } for req in requests ]
        return data_response( data )
    except AuthorizationError:
        return error_response( 'Korisnik nema ovlasti pregledavati zahtjeve za terminima', 403 )

@app.route( '/admin/requests/<int:request_id>/allow', methods = [ 'POST' ] )
@login_required
def allow_request( request_id ):
    """Allows a given request for slots

    No request parameters required.
    """
    try:
        g.user.allow_request( request_id )
        return success_response( 'Zahtjev uspješno odobren' )
    except AuthorizationError:
        return error_response( 'Korisnik nema ovlasti odobravati zahtjeve', 403 )
    except DoesNotExist:
        return error_response( 'Ne postoji zahtjev s danim id-om', 404 )

@app.route( '/admin/requests/<int:request_id>/deny', methods = [ 'POST' ] )
@login_required
def deny_request( request_id ):
    """Denies a given request for slots

    No request parameters required.
    """
    try:
        g.user.deny_request( request_id )
        return success_response( 'Zahtjev uspješno odbijen' )
    except AuthorizationError:
        return error_response( 'Korisnik nema ovlasti odbijati zahtjeve', 403 )
    except DoesNotExist:
        return error_response( 'Ne postoji zahtjev s danim id-om', 404 )


# Admin user management

@app.route( '/admin/users/list', methods = [ 'GET' ] )
@login_required
def list_users():
    """Returns a list of all the users (excluding admins and owner)

    Returns a list of dicts { id, first_name, last_name, email, account_type }
    representing users.
    No request parameters required.
    """
    try:
        users = g.user.get_all_users()
        data = [{
            'id'            : user.id,
            'first_name'    : user.first_name,
            'last_name'     : user.last_name,
            'email'         : user.email,
            'account_type'  : user.account_type
        } for user in users ]
        return data_response( data )
    except AuthorizationError:
        return error_response( 'Korisnik nema ovlasti dohvatiti popis svih korisnika', 403 )

@app.route( '/admin/users/<int:user_id>/get', methods = [ 'GET' ] )
@login_required
def get_user_data( user_id ):
    """Returns account data of user with a given id

    No request parameters required.
    """
    try:
        user = g.user.get_user_data( user_id )
        data = {
            'id'            : user.id,
            'first_name'    : user.first_name,
            'last_name'     : user.last_name,
            'email'         : user.email,
            'occupation'    : user.occupation,
            'year_of_birth' : user.year_of_birth,
            'account_type'  : user.account_type
        }
        return data_response( data )
    except AuthorizationError:
        return error_response( 'Korisnik nema ovlasti pregledavati tuđe podatke', 403 )
    except DoesNotExist:
        return error_response( 'Ne postoji korisnik s danim id-om', 404 )

@app.route( '/admin/users/<int:user_id>/modify', methods = [ 'POST' ] )
@login_required
def modify_user_data( user_id ):
    """Modify user data

    Request should contain `first_name`, `last_name`, `email`, `occupation`,
    `year_of_birth` and `password_hash` arguments.

    TODO: What if arguments not set, should we allow it?
    """
    first_name      = request.values.get( 'first_name' )
    last_name       = request.values.get( 'last_name' )
    email           = request.values.get( 'email' )
    occupation      = request.values.get( 'occupation' )
    year_of_birth   = int( request.values.get( 'year_of_birth' ) )

    try:
        validate_user_data( first_name, last_name, email, occupation, year_of_birth )
        g.user.modify_user_data( user_id, first_name, last_name, email, occupation, year_of_birth )
        return success_response( 'Korisnički podaci uspješno promjenjeni' )
    except AuthorizationError:
        return error_response( 'Korisnik nema ovlasti mijenjati podatke ovog korisnika', 403 )
    except DoesNotExist:
        return error_response( 'Ne postoji korisnik s danim id-om', 404 )
    except ValueError:
        return error_response( 'Uneseni su neispravni podaci' )
    except peewee.IntegrityError:
        return error_response( 'Email adresa se već koristi', 409 )

@app.route( '/admin/users/<int:user_id>/delete', methods = [ 'POST' ] )
@login_required
def delete_user( user_id ):
    """Deletes user with a given id

    No request parameters required.
    """
    try:
        g.user.delete_user_account( user_id )
        return success_response( 'Korisnik uspješno izbrisan' )
    except AuthorizationError:
        return error_response( 'Korisnik nema ovlasti obrisati ovog korisnika', 403 )
    except DoesNotExist:
        return error_response( 'Ne postoji korisnik s danim id-om', 404 )


# Editor slot management

@app.route( '/editor/slots/list', methods = [ 'GET' ] )
@login_required
def list_editor_slots():
    """Return a list of all editor's slots

    No request parameters required.
    """
    try:
        slots = g.user.get_all_slots()
        data = [{
            'id'    : slot.id,
            'time'  : slot.time,
            'count' : slot.count
        } for slot in slots ]
        return data_response( data )
    except AuthorizationError:
        return error_response( 'Korisnik nema mogućnost pregleda svojih termina', 403 )

@app.route( '/editor/slots/request', methods = [ 'POST' ] )
@login_required
def request_slot():
    """Make a request for time slots

    Request should contain `time`, `days_bit_mask`, `start_date` and `end_date`.
    TODO: Check type conversions
    """
    time            = request.values.get( time )
    days_bit_mask   = request.values.get( 'days_bit_mask' )
    start_date      = request.values.get( 'start_date' )
    end_date        = request.values.get( 'end_date' )

    try:
        g.user.request_slot( time, days_bit_mask, start_date, end_date )
        return success_response( 'Zahtjev uspješno pohranjen', 201 )
    except AuthorizationError:
        return error_response( 'Korisnik nema mogućnost traženja termina', 403 )

@app.route( '/editor/slots/<int:slot_id>/get_list', methods = [ 'GET' ] )
@login_required
def get_playlist( slot_id ):
    """Get current slot playlist

    Returns a list of dicts { title, artist, album, genre, index, play_duration }
    representing tracks on this slot's playlist.
    No request parameters required.
    """
    try:
        slot_items = g.user.get_slot_playlist( slot_id )
        data = [{
            'title'         :   item.track.title,
            'artist'        :   item.track.artist,
            'album'         :   item.track.album,
            'genre'         :   item.track.genre,
            'index'         :   item.index,
            'play_duration' :   item.play_duration
        } for item in slot_items ]
        return data_response( data )
    except AuthorizationError:
        return error_response( 'Korisnik nema mogućnost dohvaćanja liste za reprodukciju za ovaj termin', 403 )
    except DoesNotExist:
        return error_response( 'Ne postoji termin s danim id-om', 404 )

@app.route( '/editor/slots/<int:slot_id>/set_list', methods = [ 'POST' ] )
@login_required
def set_playlist( slot_id ):
    """Set playlist for slot with a given id

    Request should contain a list of ( index, track_id, play_duration ) representing
    tracks to be placed on the slot's playlist.
    """
    track_list = request.get_json()

    try:
        g.user.set_slot_playlist( slot_id, track_list )
        return success_response( 'Lista za reprodukciju uspješno pohranjena', 201 )
    except AuthorizationError:
        return error_response( 'Korisnik nema mogućnost sastavljanja lista za reprodukciju za ovaj termin', 403 )
    except DoesNotExist:
        return error_response( 'Ne postoji termin s danim id-om', 404 )


# Owner admins management

@app.route( '/owner/admins/list', methods = [ 'GET' ] )
@login_required
def list_admins():
    """Return a list of all admins

    Returns a list of dicts { id, first_name, last_name, email } representing administrators.
    No request parameters required.
    """
    try:
        admins = g.user.get_all_admins()
        data = [{
            'id'            : admin.id,
            'first_name'    : admin.first_name,
            'last_name'     : admin.last_name,
            'email'         : admin.email
        } for admin in admins ]
        return data_response( data )
    except AuthorizationError:
        return error_response( 'Korisnik nema mogućnost pregledavanja popisa administratora', 403 )

@app.route( '/owner/admins/add/<int:user_id>', methods = [ 'POST' ] )
@login_required
def add_admin( user_id ):
    """Grant administrative privileges to user with `user_id`

    No request parameters required.
    """
    try:
        g.user.add_admin( user_id )
        return success_response( 'Korisnik uspješno postavljen za administratora' )
    except AuthorizationError:
        return error_response( 'Korisnik nema ovlasti postavljati administratore', 403 )
    except DoesNotExist:
        return error_response( 'Ne postoji korisnik s danim id-om', 404 )
    except TypeError as e:
        return error_response( str( e ) )

@login_required
@app.route( '/owner/admins/<int:admin_id>/remove', methods = [ 'POST' ] )
def remove_admin( admin_id ):
    """Revoke administrative privileges from user with `admin_id`

    No request parameters required.
    """
    try:
        g.user.remove_admin( admin_id )
        return success_response( 'Korisniku uspješno ukinute administratorske ovlasti' )
    except AuthorizationError:
        return error_response( 'Korisnik nema ovlasti uklanjati administratore', 403 )
    except DoesNotExist:
        return error_response( 'Ne postoji korisnik s danim id-om', 404 )
    except TypeError as e:
        return error_response( str( e ) )


# Owner radiostation management

@app.route( '/owner/station/modify', methods = [ 'POST' ] )
@login_required
def modify_station_data():
    """Modify radio station data

    Request should contain `name`, `oib`, `address`, `email` and `frequency`.
    """
    name        = request.values.get( 'name' )
    oib         = request.values.get( 'oib' )
    address     = request.values.get( 'address' )
    email       = request.values.get( 'email' )
    frequency   = float( request.values.get( 'frequency' ) )

    try:
        validate_radio_station_data( name, oib, address, email, frequency )
        g.user.modify_station_data( name, oib, address, email, frequency )
        return success_response( 'Podaci o postaji uspješno promjenjeni' )
    except AuthorizationError:
        return error_response( 'Korisnik nema ovlasti mijenjati podatke o radio postaji', 403 )
    except ValueError:
        return error_response( 'Uneseni su neispravni podaci' )


# Track routes

@app.route( '/tracks/list', methods = [ 'GET' ] )
@login_required
def list_tracks():
    """Return a list of all tracks

    No request parameters required.
    """
    tracks = Track.get_tracks()
    data = [{
        'id'                : track.id,
        'title'             : track.title,
        'artist'            : track.artist,
        'album'             : track.album,
        'duration'          : track.duration,
        'file_format'       : track.file_format,
        'sample_rate'       : track.sample_rate,
        'bits_per_sample'   : track.bits_per_sample,
        'genre'             : track.genre,
        'publisher'         : track.publisher,
        'carrier_type'      : track.carrier_type,
        'year'              : track.year
    } for track in tracks ]
    return data_response( data )

@app.route( '/tracks/<int:track_id>/get', methods = [ 'GET' ] )
@login_required
def get_track( track_id ):
    """Return track data of track with `track_id`

    No request parameters required.
    """
    track = Track.get( Track.id == track_id )
    data = {
        'id'                : track.id,
        'title'             : track.title,
        'artist'            : track.artist,
        'album'             : track.album,
        'duration'          : track.duration,
        'file_format'       : track.file_format,
        'sample_rate'       : track.sample_rate,
        'bits_per_sample'   : track.bits_per_sample,
        'genre'             : track.genre,
        'publisher'         : track.publisher,
        'carrier_type'      : track.carrier_type,
        'year'              : track.year
    }
    return data_response( data )

@app.route( '/tracks/search', methods = [ 'GET' ] )
@login_required
def search_tracks():
    return not_implemented_response()

@app.route( '/tracks/wishlist', methods = [ 'GET' ] )
@login_required
def get_wishlist():
    """Return the global wishlist

    No request parameters required.
    """
    try:
        wishlist = g.user.get_global_wishlist()
        data = [{

        } for wish in wishlist ]
        return data_response( data )
    except AuthorizationError:
        return error_response( '', 403 )


# Stat routes

@app.route( '/stats/wishlist', methods = [ 'GET' ] )
@login_required
def get_global_wishlist_stat():
    return not_implemented_response()

@app.route( '/stats/active_users/count', methods = [ 'GET' ] )
@login_required
def get_active_users_count():
    return not_implemented_response()

@app.route( '/stats/active_admins/list', methods = [ 'GET' ] )
@login_required
def get_active_admins_list():
    return not_implemented_response()

@app.route( '/stats/editor/<int:editor_id>/preferred_tracks', methods = [ 'GET' ] )
def get_editor_preferred_tracks( editor_id ):
    return not_implemented_response()
