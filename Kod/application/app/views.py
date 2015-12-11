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
    # TODO: possible error - int vs. string
    g.user = User.get( User.id == session[ 'user_id' ] ) if 'user_id' in session else None

    if g.user is not None:
        g.user.update_activity()


# Display routes

@app.route( '/' )
def show_index():
    return 'Index'

@app.route( '/settings' )
@login_required
def show_settings():
    return 'Settings'


# Play route

@app.route( '/player/get', methods = [ 'GET' ] )
def get_currently_playing_track():
    pass


# User auth

@app.route( '/user/auth/login', methods = [ 'POST' ] )
def process_login():
    pass

@app.route( '/user/auth/register', methods = [ 'POST' ] )
def process_registration():
    pass

@app.route( '/user/auth/activate/<activation_code>', methods = [ 'GET' ] )
def process_activation( activation_code ):
    pass

@app.route( '/user/auth/signout', methods = [ 'GET' ] )
@login_required
def process_signout():
    pass


# User account management

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
def delete_account():
    pass

@app.route( '/user/account/change_password', methods = [ 'POST' ] )
@login_required
def change_account_password():
    pass


# User wishlist management

@app.route( '/user/wishlist/get', methods = [ 'GET' ] )
@login_required
def get_wishlist():
    pass


@app.route( '/user/wishlist/set', methods = [ 'POST' ] )
@login_required
def set_wishlist():
    pass


@app.route( '/user/wishlist/confirm', methods = [ 'POST' ] )
@login_required
def confirm_wishlist():
    pass


# Admin track management

@app.route( '/admin/tracks/add', methods = [ 'POST' ] )
@login_required
def add_track():
    pass

@app.route( '/admin/tracks/<int:track_id>/edit', methods = [ 'POST' ] )
@login_required
def edit_track( track_id ):
    pass

@app.route( '/admin/tracks/<int:track_id>/delete', methods = [ 'POST' ] )
@login_required
def delete_track( track_id ):
    pass


# Admin editors management

@app.route( '/admin/editors/list', methods = [ 'GET' ] )
@login_required
def list_editors():
    pass

@app.route( '/admin/editors/add/<int:user_id>', methods = [ 'POST' ] )
@login_required
def add_editor( user_id ):
    pass

@app.route( '/admin/editors/<int:editor_id>/remove', methods = [ 'POST' ] )
@login_required
def remove_editor( editor_id ):
    pass


# Admin requests management

@app.route( '/admin/requests/list', methods = [ 'GET' ] )
@login_required
def list_requests():
    pass

@app.route( '/admin/requests/<int:request_id>/allow', methods = [ 'POST' ] )
@login_required
def allow_request( request_id ):
    pass

@app.route( '/admin/requests/<int:request_id>/deny', methods = [ 'POST' ] )
@login_required
def deny_request( request_id ):
    pass


# Admin user management

@app.route( '/admin/users/list', methods = [ 'GET' ] )
@login_required
def list_users():
    pass

@app.route( '/admin/users/<int:user_id>/get', methods = [ 'GET' ] )
@login_required
def get_user_data( user_id ):
    pass

@app.route( '/admin/users/<int:user_id>/modify', methods = [ 'POST' ] )
@login_required
def modify_user_data( user_id ):
    pass

@app.route( '/admin/users/<int:user_id>/delete', methods = [ 'POST' ] )
@login_required
def delete_user( user_id ):
    pass


# Editor slot management

@app.route( '/editor/slots/list', methods = [ 'GET' ] )
@login_required
def list_editor_slots():
    pass

@app.route( '/editor/slots/request', methods = [ 'POST' ] )
@login_required
def request_slot():
    pass

@app.route( '/editor/slots/<int:slot_id>/get_list', methods = [ 'GET' ] )
@login_required
def get_list( slot_id ):
    pass

@app.route( '/editor/slots/<int:slot_id>/set_list', methods = [ 'POST' ] )
@login_required
def set_list( slot_id ):
    pass


# Owner admins management

@app.route( '/owner/admins/list', methods = [ 'GET' ] )
@login_required
def list_admins():
    pass

@app.route( '/owner/admins/add/<int:user_id>', methods = [ 'POST' ] )
@login_required

def add_admin( user_id ):
    pass
@login_required
@app.route( '/owner/admins/<int:admin_id>/remove', methods = [ 'POST' ] )
def remove_admin( admin_id ):
    pass


# Owner radiostation management

@app.route( '/owner/station/modify', methods = [ 'POST' ] )
@login_required
def modify_station_data():
    pass


# Track routes

@app.route( '/tracks/list', methods = [ 'GET' ] )
@login_required
def list_tracks():
    pass

@app.route( '/tracks/<int:track_id>/get', methods = [ 'GET' ] )
@login_required
def get_track( track_id ):
    pass

@app.route( '/tracks/search', methods = [ 'GET' ] )
@login_required
def search_tracks():
    pass


# Stat routes

@app.route( '/stats/wishlist', methods = [ 'GET' ] )
@login_required
def get_wishlist():
    pass

@app.route( '/stats/active_users/count', methods = [ 'GET' ] )
@login_required
def get_active_users_count():
    pass

@app.route( '/stats/active_admins/list', methods = [ 'GET' ] )
@login_required
def get_active_admins_list():
    pass

@app.route( '/stats/editor/<int:editor_id>/preferred_tracks', methods = [ 'GET' ] )
def get_editor_preferred_tracks( editor_id ):
    pass
