from flask import g, redirect, request, render_template, session
from peewee import DoesNotExist

from app import app
from app.decorators import *
from app.helpers import *
from app.models import *
from app.validators import EmailValidator

# Pre-request setup

@app.before_request
def preprocess_request():
    """Before processing each request, make the current user available to everyone via flask g object"""
    g.user = User.get( User.id == session[ 'user_id' ] ) if 'user_id' in session else None


# Main view

@app.route( '/' )
def show_index():
    return 'Index page'


@app.route( '/play', methods = [ 'POST' ] )
def get_currently_playing_track():
    pass

# User - auth

@app.route( '/user/auth/login', methods = [ 'POST' ] )
def process_login():
    email = request.values.get( 'email' )
    password_hash = request.values.get( 'password_hash' )

    try:
        EmailValidator().validate( email )
        user = User.authenticate_user( email, password_hash )

        if user is not None:
            session[ 'user_id' ] = user.id
            return success_response( 'Uspješna prijava' )
        else:
            return error_response( 'Netočna lozinka' )

    except ValueError:
        return error_response( 'Email adresa nije ispravna' )
    except DoesNotExist:
        return error_response( 'Ne postoji korisnik s danom email adresom' )

@app.route( '/user/auth/register', methods = [ 'POST' ] )
def process_register():
    first_name = request.values.get( 'first_name' )
    last_name = request.values.get( 'last_name' )
    email = request.values.get( 'email' )
    occupation = request.values.get( 'occupation' )
    password_hash = request.values.get( 'password_hash' )

    try:
        CharValidator( min_length = 2, max_length = 64 ).validate( first_name )
        CharValidator( min_length = 2, max_length = 64 ).validate( last_name )
        CharValidator( min_length = 2, max_length = 64 ).validate( occupation )
        EmailValidator().validate( email )
        CharValidator( min_length = 64, max_length = 64 ).validate( password_hash )

        user = User.create_user( first_name, last_name, occupation, email, password_hash )
        # send email

        if user is not None:
            return success_response( 'Uspješna registracija' )
        else:
            return error_response( 'Registracija neuspjela' )
    except ValueError:
        return error_response( 'Uneseni su neispravni podaci' )
    except peewee.IntegrityError:
        return error_response( 'Već postoji korisnik s danom email adresom' )

@app.route( '/user/auth/confirm', methods = [ 'GET' ] )
def process_confirm():
    pass


# User - account

@app.route( '/user/account/get', methods = [ 'GET' ] )
@login_required
def get_account_data():
    pass

@app.route( '/user/account/modify', methods = [ 'POST' ] )
@login_required
def modify_account_data():
    pass

@app.route( '/user/account/delete', methods = [ 'POST' ] )
@login_required
def delete_account_account():
    pass

@app.route( '/user/account/password', methods = [ 'POST' ] )
@login_required
def change_account_password():
    pass


# Admin - users

@app.route( '/admin/users/list', methods = [ 'GET' ] )
@login_required
def list_users():
    pass

@app.route( '/admin/users/<int:id>/get', methods = [ 'GET' ] )
@login_required
def get_user_data( id ):
    pass

@app.route( '/admin/users/<int:id>/edit', methods = [ 'POST' ] )
@login_required
def edit_user_data( id ):
    pass

@app.route( '/admin/users/<int:id>/delete', methods = [ 'POST' ] )
@login_required
def delete_user( id ):
    pass


# Admin - editors

@app.route( '/admin/editors/list', methods = [ 'GET' ] )
@login_required
def list_editors():
    pass

@app.route( '/admin/editors/<int:id>/set', methods = [ 'POST' ] )
@login_required
def set_as_editor( id ):
    pass

@app.route( '/admin/editors/<int:id>/unset', methods = [ 'POST' ] )
@login_required
def unset_as_editor( id ):
    pass

@app.route( '/admin/editors/requests/list', methods = [ 'GET' ] )
@login_required
def list_pending_requests():
    pass

@app.route( '/admin/editors/requests/<int:id>/allow', methods = [ 'POST' ] )
@login_required
def allow_editor_request( id ):
    pass

@app.route( '/admin/editors/requests/<int:id>/deny', methods = [ 'POST' ] )
@login_required
def deny_editor_request( id ):
    pass

@app.route( '/admin/editors/<int:id>/slots/<int:slot_id>/assign', methods = [ 'POST' ] )
@login_required
def assign_slot_to_editor( id, slot_id ):
    pass

@app.route( '/admin/editors/<int:id>/slots/<int:slot_id>/unassign', methods = [ 'POST' ] )
@login_required
def unassign_slot_to_editor( id, slot_id ):
    pass


# Admin - tracks

@app.route( '/admin/tracks/list', methods = [ 'GET' ] )
@login_required
def list_tracks():
    return 'tracks'

@app.route( '/admin/tracks/add', methods = [ 'POST' ] )
@login_required
def add_track():
    pass

@app.route( '/admin/tracks/<int:track_id>/get', methods = [ 'POST' ] )
@login_required
def get_track( track_id ):
    pass

@app.route( '/admin/tracks/<int:track_id>/edit', methods = [ 'POST' ] )
@login_required
def edit_track( track_id ):
    pass

@app.route( '/admin/tracks/<int:track_id>/delete', methods = [ 'POST' ] )
@login_required
def delete_track( track_id ):
    pass


# Editor - slot management

@app.route( '/editor/<int:id>/slots/list', methods = [ 'GET' ] )
@login_required
def list_editor_slots( id ):
    pass

@app.route( '/editor/<int:id>/slots/request', methods = [ 'POST' ] )
@login_required
def request_slot( id ):
    pass


# Editor - playlists

@app.route( '/editor/<int:id>/slots/<int:slot_id>/get', methods = [ 'GET' ] )
@login_required
def get_editor_slot_playlist( id, slot_id ):
    pass

@app.route( '/editor/<int:id>/slots/<int:slot_id>/set', methods = [ 'POST' ] )
@login_required
def set_editor_slot_playlist( id, slot_id ):
    pass


# Owner - admins

@app.route( '/owner/admins/list', methods = [ 'GET' ] )
@login_required
def get_admins():
    pass

@app.route( '/owner/admins/<int:id>/set', methods = [ 'POST' ] )
@login_required
def set_as_admin( id ):
    pass

@app.route( '/owner/admins/<int:id>/unset', methods = [ 'POST' ] )
@login_required
def unset_as_admin( id ):
    pass


# Owner - radio station

@app.route( '/owner/station/get', methods = [ 'POST' ] )
@login_required
def get_station_data():
    pass

@app.route( '/owner/station/edit', methods = [ 'POST' ] )
@login_required
def edit_station_data():
    pass


# Stats

@app.route( '/stats/wishlist/get', methods = [ 'GET' ] )
@login_required
def get_wishlist():
    pass

@app.route( '/stats/users/active/count', methods = [ 'GET' ] )
@login_required
def get_active_users_count():
    pass

@app.route( '/stats/admins/active/list', methods = [ 'GET' ] )
@login_required
def list_active_admins():
    pass

@app.route( '/stats/editors/<int:id>/tracks/preferred/list', methods = [ 'GET' ] )
@login_required
def list_editors_preferred_tracks( id ):
    pass
