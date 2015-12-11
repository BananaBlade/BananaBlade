from flask import g, redirect, request, render_template, send_file, session
from peewee import DoesNotExist

from app import app
from app.decorators import *
from app.helpers import *
from app.models import *
from app.validators import CharValidator, EmailValidator

# Various todos:
#       TODO: Check track path on input for possible malicious attacks
#       TODO: Setup cache to enable proper signing out (otherwise user could remain
#             signed in for a while)


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
    """Returns currently playing track as a file"""
    try:
        track = Track.get_currently_playing()
        return send_file( track.path )
    except DoesNotExist:
        return error_response( 'Nije moguće dohvatiti trenutno svirani zapis', 404 )

@app.route( '/player/info', methods = [ 'GET' ] )
def get_currently_playing_track_info():
    """Returns informations about the currently playing track"""
    try:
        track = Track.get_currently_playing()
        data = {
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

    TODO: Decide upon return type
    """
    email           = request.values.get( 'email' )
    password_hash   = request.values.get( 'password_hash' )

    try:
        EmailValidator().validate( email )
        user = User.authenticate_user( email, password_hash )
        session[ 'user_id' ] = user.id
        pass # return success_response( 'Uspješna prijava' )
    except ValueError:
        pass # return error_response( 'Email adresa nije ispravna' )
    except DoesNotExist:
        pass # return error_response( 'Ne postoji korisnik s danom email adresom' )
    except AuthenticationError as e:
        pass # return error_response( str( e ) )

@app.route( '/user/auth/register', methods = [ 'POST' ] )
def process_registration():
    """Process user registration

    Request should contain `first_name`, `last_name`, `email`, `occupation`,
    `year_of_birth` and `password_hash` arguments.

    TODO: Decide upon return type
    """
    first_name      = request.values.get( 'first_name' )
    last_name       = request.values.get( 'last_name' )
    occupation      = request.values.get( 'occupation' )
    year_of_birth   = int( request.values.get( 'year_of_birth' ) )
    email           = request.values.get( 'email' )
    password_hash   = request.values.get( 'password_hash' )

    try:
        CharValidator( min_length = 2, max_length = 64 ).validate( first_name )
        CharValidator( min_length = 2, max_length = 64 ).validate( last_name )
        CharValidator( min_length = 2, max_length = 64 ).validate( occupation )
        IntValidator( minimum = 1900, maximum = 2100 ).validate( year_of_birth )
        EmailValidator().validate( email )
        CharValidator( min_length = 64, max_length = 64 ).validate( password_hash )

        user = User.create_user( first_name, last_name, occupation, email, password_hash )
        # TODO: Send email with the activation code

        if user is not None:
            pass # return success_response( 'Registracija uspješna', 201 )
        else:
            pass # return error_response( 'Registracija nije uspjela', 500 )
    except ValueError:
        pass # return error_response( 'Uneseni su neispravni podaci' )
    except peewee.IntegrityError:
        pass # return error_response( 'Već postoji korisnik s danom email adresom' )

@app.route( '/user/auth/activate/<activation_code>', methods = [ 'GET' ] )
def process_activation( activation_code ):
    """Process account activation

    No request parameters required, `activation_code` obtained from the URL
    """
    try:
        User.activate_user( activation_code )
        pass # Return sth
    except DoesNotExist:
        pass # return error_response( 'Ne postoji korisnik s danim aktivacijskim kodom' )

@app.route( '/user/auth/signout', methods = [ 'GET' ] )
@login_required
def process_signout():
    """Process user signout

    After signing out, user is redirected to the index page
    """
    session.clear()
    return redirect( '/' )


# User account management

@app.route( '/user/account/get', methods = [ 'GET' ] )
@login_required
def get_account_data():
    """Return user account data

    No request arguments required.
    """
    data = {
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
    return not_implemented_response()

@app.route( '/user/account/delete', methods = [ 'POST' ] )
@login_required
def delete_account():
    return not_implemented_response()

@app.route( '/user/account/change_password', methods = [ 'POST' ] )
@login_required
def change_account_password():
    return not_implemented_response()


# User wishlist management

@app.route( '/user/wishlist/get', methods = [ 'GET' ] )
@login_required
def get_wishlist():
    return not_implemented_response()


@app.route( '/user/wishlist/set', methods = [ 'POST' ] )
@login_required
def set_wishlist():
    return not_implemented_response()


@app.route( '/user/wishlist/confirm', methods = [ 'POST' ] )
@login_required
def confirm_wishlist():
    return not_implemented_response()


# Admin track management

@app.route( '/admin/tracks/add', methods = [ 'POST' ] )
@login_required
def add_track():
    return not_implemented_response()

@app.route( '/admin/tracks/<int:track_id>/edit', methods = [ 'POST' ] )
@login_required
def edit_track( track_id ):
    return not_implemented_response()

@app.route( '/admin/tracks/<int:track_id>/delete', methods = [ 'POST' ] )
@login_required
def delete_track( track_id ):
    return not_implemented_response()


# Admin editors management

@app.route( '/admin/editors/list', methods = [ 'GET' ] )
@login_required
def list_editors():
    return not_implemented_response()

@app.route( '/admin/editors/add/<int:user_id>', methods = [ 'POST' ] )
@login_required
def add_editor( user_id ):
    return not_implemented_response()

@app.route( '/admin/editors/<int:editor_id>/remove', methods = [ 'POST' ] )
@login_required
def remove_editor( editor_id ):
    return not_implemented_response()


# Admin requests management

@app.route( '/admin/requests/list', methods = [ 'GET' ] )
@login_required
def list_requests():
    return not_implemented_response()

@app.route( '/admin/requests/<int:request_id>/allow', methods = [ 'POST' ] )
@login_required
def allow_request( request_id ):
    return not_implemented_response()

@app.route( '/admin/requests/<int:request_id>/deny', methods = [ 'POST' ] )
@login_required
def deny_request( request_id ):
    preturn not_implemented_response()ass


# Admin user management

@app.route( '/admin/users/list', methods = [ 'GET' ] )
@login_required
def list_users():
    return not_implemented_response()

@app.route( '/admin/users/<int:user_id>/get', methods = [ 'GET' ] )
@login_required
def get_user_data( user_id ):
    return not_implemented_response()

@app.route( '/admin/users/<int:user_id>/modify', methods = [ 'POST' ] )
@login_required
def modify_user_data( user_id ):
    return not_implemented_response()

@app.route( '/admin/users/<int:user_id>/delete', methods = [ 'POST' ] )
@login_required
def delete_user( user_id ):
    return not_implemented_response()


# Editor slot management

@app.route( '/editor/slots/list', methods = [ 'GET' ] )
@login_required
def list_editor_slots():
    return not_implemented_response()

@app.route( '/editor/slots/request', methods = [ 'POST' ] )
@login_required
def request_slot():
    return not_implemented_response()

@app.route( '/editor/slots/<int:slot_id>/get_list', methods = [ 'GET' ] )
@login_required
def get_list( slot_id ):
    return not_implemented_response()

@app.route( '/editor/slots/<int:slot_id>/set_list', methods = [ 'POST' ] )
@login_required
def set_list( slot_id ):
    return not_implemented_response()


# Owner admins management

@app.route( '/owner/admins/list', methods = [ 'GET' ] )
@login_required
def list_admins():
    return not_implemented_response()

@app.route( '/owner/admins/add/<int:user_id>', methods = [ 'POST' ] )
@login_required
def add_admin( user_id ):
    return not_implemented_response()

@login_required
@app.route( '/owner/admins/<int:admin_id>/remove', methods = [ 'POST' ] )
def remove_admin( admin_id ):
    return not_implemented_response()


# Owner radiostation management

@app.route( '/owner/station/modify', methods = [ 'POST' ] )
@login_required
def modify_station_data():
    return not_implemented_response()


# Track routes

@app.route( '/tracks/list', methods = [ 'GET' ] )
@login_required
def list_tracks():
    return not_implemented_response()

@app.route( '/tracks/<int:track_id>/get', methods = [ 'GET' ] )
@login_required
def get_track( track_id ):
    return not_implemented_response()

@app.route( '/tracks/search', methods = [ 'GET' ] )
@login_required
def search_tracks():
    return not_implemented_response()


# Stat routes

@app.route( '/stats/wishlist', methods = [ 'GET' ] )
@login_required
def get_wishlist():
    pasreturn not_implemented_response()s

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
