from flask import g, redirect, request, render_template, session
from peewee import DoesNotExist

from app import app
from app.decorators import *
from app.helpers import *
from app.models import *
from app.validators import CharValidator, EmailValidator

# Pre-request setup

@app.before_request
def preprocess_request():
    """Before processing each request, make the current user available to everyone via flask g object,
    and store activity time"""
    g.user = User.get( User.id == session[ 'user_id' ] ) if 'user_id' in session else None

    if g.user is not None:
        g.user.update_activity()

# Main view

@app.route( '/' )
def show_index():
    return 'Index page'

@app.route( '/player/get', methods = [ 'POST' ] )
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
            return success_response( 'Uspješna registracija', 201 )
        else:
            return error_response( 'Registracija neuspjela', 500 )
    except ValueError:
        return error_response( 'Uneseni su neispravni podaci', 400 )
    except peewee.IntegrityError:
        return error_response( 'Već postoji korisnik s danom email adresom', 400 )

@app.route( '/user/auth/confirm', methods = [ 'GET' ] )
def process_confirm():
    return not_implemented_response()


# User - account

@app.route( '/user/account/get', methods = [ 'GET' ] )
@login_required
def get_account_data():
    data = {
        'user_id' : g.user.id,
        'first_name' : g.user.first_name,
        'last_name' : g.user.last_name,
        'occupation' : g.user.occupation,
        'email' : g.user.email,
        'account_type' : g.user.account_type
    }
    return data_response( data )

@app.route( '/user/account/modify', methods = [ 'POST' ] )
@login_required
def modify_account_data():
    first_name = request.values.get( 'first_name' )
    last_name = request.values.get( 'last_name' )
    occupation = request.values.get( 'occupation' )
    email = request.values.get( 'email' )

    g.user.modify_account( first_name, last_name, occupation, email )
    return success_response( 'Korisnički podaci izmjenjeni' )

@app.route( '/user/account/delete', methods = [ 'POST' ] )
@login_required
def delete_account():
    password_hash = request.values.get( 'password_hash' )
    if g.user.password_hash != password_hash:
        return error_response( 'Netočna lozinka', 403 )

    User.delete_user( g.user.id )
    session.clear()
    return success_response( 'Korisnički račun uspješno obrisan' )

@app.route( '/user/account/password', methods = [ 'POST' ] )
@login_required
def change_account_password():
    old_password_hash = request.values.get( 'old_password_hash' )
    new_password_hash = request.values.get( 'new_password_hash' )

    if g.user.password_hash != old_password_hash:
        return error_response( 'Netočna stara lozinka', 403 )

    g.user.change_password( new_password_hash )
    return success_message( 'Lozinka uspješno promjenjena' )


# Admin - users

@app.route( '/admin/users/list', methods = [ 'GET' ] )
@login_required
def list_users():
    try:
        users = g.user.get_all_users()
        data = [ {
            'user_id' : user.id,
            'first_name' : user.first_name,
            'last_name' : user.last_name,
            'occupation' : user.occupation,
            'email' : user.email,
            'account_type' : user.account_type
        } for user in users ]
        return data_response( data )
    except PermissionError:
        return error_response( 'Nedozvoljena operacija', 403 )


@app.route( '/admin/users/<int:id>/get', methods = [ 'GET' ] )
@login_required
def get_user_data( id ):
    try:
        user = g.user.get_user_account( id )
        data = {
            'user_id' : user.id,
            'first_name' : user.first_name,
            'last_name' : user.last_name,
            'occupation' : user.occupation,
            'email' : user.email,
            'account_type' : user.account_type,
            'activated' : user.activated
        }
        return data_response( data )
    except PermissionError:
        return error_response( 'Nedozvoljena operacija', 403 )

@app.route( '/admin/users/<int:id>/edit', methods = [ 'POST' ] )
@login_required
def edit_user_data( id ):
    try:
        first_name = request.values.get( 'first_name' )
        last_name = request.values.get( 'last_name' )
        occupation = request.values.get( 'occupation' )
        email = request.values.get( 'email' )

        g.user.change_user_account( id, first_name, last_name, occupation, email )
        return success_response( 'Korisnički podaci uspješno promjenjeni' )
    except DoesNotExist:
        return error_response( 'Ne postoji korisnik s danim id-jem' )
    except PermissionError:
        return error_response( 'Nedozvoljena operacija', 403 )

@app.route( '/admin/users/<int:id>/delete', methods = [ 'POST' ] )
@login_required
def delete_user( id ):
    try:
        g.user.delete_user_account( id )
        return success_response( 'Korisnik uspješno izbrisan' )
    except DoesNotExist:
        return error_response( 'Ne postoji korisnik s danim id-jem' )
    except PermissionError:
        return error_response( 'Nedozvoljena operacija', 403 )


# Admin - editors

@app.route( '/admin/editors/list', methods = [ 'GET' ] )
@login_required
def list_editors():
    try:
        editors = g.user.get_all_editors()
        data = [ {
            'user_id' : user.id,
            'first_name' : user.first_name,
            'last_name' : user.last_name,
            'occupation' : user.occupation,
            'email' : user.email,
            'account_type' : user.account_type
        } for user in editors ]
        return data_response( data )
    except PermissionError:
        return error_response( 'Nedozvoljena operacija', 403 )

@app.route( '/admin/editors/<int:id>/set', methods = [ 'POST' ] )
@login_required
def set_as_editor( id ):
    try:
        g.user.set_user_as_editor( id )
        return success_response( 'Korisnik uspješno postavljen za urednika' )
    except DoesNotExist:
        return error_response( 'Ne postoji korisnik s danim id-jem' )
    except PermissionError:
        return error_response( 'Nedozvoljena operacija', 403 )
    except ValueError:
        return error_response( 'Korisnik ne može postati urednikom' )

@app.route( '/admin/editors/<int:id>/unset', methods = [ 'POST' ] )
@login_required
def unset_as_editor( id ):
    try:
        g.user.unset_user_as_editor( id )
        return success_response( 'Korisnik uspješno uklonjen s popisa urednika' )
    except DoesNotExist:
        return error_response( 'Ne postoji korisnik s danim id-jem' )
    except PermissionError:
        return error_response( 'Nedozvoljena operacija', 403 )
    except ValueError:
        return error_response( 'Korisnik nije urednik' )

@app.route( '/admin/editors/requests/list', methods = [ 'GET' ] )
@login_required
def list_pending_requests():
    return not_implemented_response()

@app.route( '/admin/editors/requests/<int:id>/allow', methods = [ 'POST' ] )
@login_required
def allow_editor_request( id ):
    return not_implemented_response()

@app.route( '/admin/editors/requests/<int:id>/deny', methods = [ 'POST' ] )
@login_required
def deny_editor_request( id ):
    return not_implemented_response()

@app.route( '/admin/editors/<int:id>/slots/<int:slot_id>/assign', methods = [ 'POST' ] )
@login_required
def assign_slot_to_editor( id, slot_id ):
    return not_implemented_response()

@app.route( '/admin/editors/<int:id>/slots/<int:slot_id>/unassign', methods = [ 'POST' ] )
@login_required
def unassign_slot_to_editor( id, slot_id ):
    return not_implemented_response()


# Admin - tracks

@app.route( '/admin/tracks/list', methods = [ 'GET' ] )
@login_required
def list_tracks():
    return not_implemented_response()

@app.route( '/admin/tracks/add', methods = [ 'POST' ] )
@login_required
def add_track():
    return not_implemented_response()

@app.route( '/admin/tracks/<int:track_id>/get', methods = [ 'POST' ] )
@login_required
def get_track( track_id ):
    return not_implemented_response()

@app.route( '/admin/tracks/<int:track_id>/edit', methods = [ 'POST' ] )
@login_required
def edit_track( track_id ):
    return not_implemented_response()

@app.route( '/admin/tracks/<int:track_id>/delete', methods = [ 'POST' ] )
@login_required
def delete_track( track_id ):
    return not_implemented_response()


# Editor - slot management

@app.route( '/editor/<int:id>/slots/list', methods = [ 'GET' ] )
@login_required
def list_editor_slots( id ):
    return not_implemented_response()

@app.route( '/editor/<int:id>/slots/request', methods = [ 'POST' ] )
@login_required
def request_slot( id ):
    return not_implemented_response()


# Editor - playlists

@app.route( '/editor/<int:id>/slots/<int:slot_id>/get', methods = [ 'GET' ] )
@login_required
def get_editor_slot_playlist( id, slot_id ):
    return not_implemented_response()

@app.route( '/editor/<int:id>/slots/<int:slot_id>/set', methods = [ 'POST' ] )
@login_required
def set_editor_slot_playlist( id, slot_id ):
    return not_implemented_response()


# Owner - admins

@app.route( '/owner/admins/list', methods = [ 'GET' ] )
@login_required
def get_admins():
    return not_implemented_response()

@app.route( '/owner/admins/<int:id>/set', methods = [ 'POST' ] )
@login_required
def set_as_admin( id ):
    return not_implemented_response()

@app.route( '/owner/admins/<int:id>/unset', methods = [ 'POST' ] )
@login_required
def unset_as_admin( id ):
    return not_implemented_response()


# Owner - radio station

@app.route( '/owner/station/get', methods = [ 'POST' ] )
@login_required
def get_station_data():
    try:
        station = g.user.get_station()
        data = {
            'name' : station.name,
            'frequency' : station.frequency,
            'oib' : station.oib,
            'address' : station.address,
            'email' : station.email
        }
        return data_response( data )
    except PermissionError:
        return error_response( 'Nedozvoljena operacija', 403 )

@app.route( '/owner/station/edit', methods = [ 'POST' ] )
@login_required
def edit_station_data():
    return not_implemented_response()


# Stats

@app.route( '/stats/wishlist/get', methods = [ 'GET' ] )
@login_required
def get_wishlist():
    return not_implemented_response()

@app.route( '/stats/users/active/count', methods = [ 'GET' ] )
@login_required
def get_active_users_count():
    return not_implemented_response()

@app.route( '/stats/admins/active/list', methods = [ 'GET' ] )
@login_required
def list_active_admins():
    return not_implemented_response()

@app.route( '/stats/editors/<int:id>/tracks/preferred/list', methods = [ 'GET' ] )
@login_required
def list_editors_preferred_tracks( id ):
    return not_implemented_response()
