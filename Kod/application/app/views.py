from app import app

from flask import g, redirect, render_template, session

# Pre-request setup

@app.before_request
def preprocess_request():
    """Before processing each request, make the current user available to everyone via flask g object"""
    g.user = User.get( User.id == session[ 'user_id' ] ) if 'user_id' in session else None


# Main view

@app.route( '/' )
def show_index():
    return 'Index page'


# User - auth

@app.route( '/user/auth/login', methods = [ 'POST' ] )
def process_login():
    pass

@app.route( '/user/auth/register', methods = [ 'POST' ] )
def process_register():
    pass

@app.route( '/user/auth/confirm', methods = [ 'GET' ] )
def process_confirm():
    pass


# User - account

@app.route( '/user/account/get', methods = [ 'GET' ] )
def get_account_data():
    pass

@app.route( '/user/account/modify', methods = [ 'POST' ] )
def modify_account_data():
    pass

@app.route( '/user/account/delete', methods = [ 'POST' ] )
def delete_account_account():
    pass

@app.route( '/user/account/password', methods = [ 'POST' ] )
def change_account_password():
    pass


# Admin - users

@app.route( '/admin/users/list', methods = [ 'GET' ] )
def list_users():
    pass

@app.route( '/admin/users/<int:id>/edit', methods = [ 'POST' ] )
def edit_user_data( id ):
    pass

@app.route( '/admin/users/<int:id>/delete', methods = [ 'POST' ] )
def delete_user( id ):
    pass


# Admin - editors

@app.route( '/admin/editors/list', methods = [ 'GET' ] )
def list_editors():
    pass

@app.route( '/admin/editors/<int:id>/set', methods = [ 'POST' ] )
def set_as_editor( id ):
    pass

@app.route( '/admin/editors/<int:id>/unset', methods = [ 'POST' ] )
def unset_as_editor( id ):
    pass

@app.route( '/admin/editors/requests/list', methods = [ 'GET' ] )
def list_pending_requests():
    pass

@app.route( '/admin/editors/requests/<int:id>/allow', methods = [ 'POST' ] )
def allow_editor_request( id ):
    pass

@app.route( '/admin/editors/requests/<int:id>/deny', methods = [ 'POST' ] )
def deny_editor_request( id ):
    pass

@app.route( '/admin/editors/<int:id>/slots/<int:slot_id>/assign', methods = [ 'POST' ] )
def assign_slot_to_editor( id, slot_id ):
    pass

@app.route( '/admin/editors/<int:id>/slots/<int:slot_id>/unassign', methods = [ 'POST' ] )
def unassign_slot_to_editor( id, slot_id ):
    pass


# Admin - tracks

@app.rout( '/admin/tracks/list', methods = [ 'GET' ] )
def list_tracks():
    pass

@app.route( '/admin/tracks/add', methods = [ 'POST' ] )
def add_track():
    pass

@app.route( '/admin/tracks/<int:id>/edit', methods = [ 'POST' ] )
def edit_track( id ):
    pass

@app.route( '/admin/tracks/<int:id>/delete', methods = [ 'POST' ] )
def delete_track( id ):
    pass


# Editor - slot management

@app.roue( '/editor/<int:id>/slots/list', methods = [ 'GET' ] )
def list_editor_slots( id ):
    pass

@app.route( '/editor/<int:id>/slots/request', methods = [ 'POST' ] )
def request_slot( id ):
    pass


# Editor - playlists

@app.route( '/editor/<int:id>/slots/<int:slot_id>/get', methods = [ 'GET' ] )
def get_editor_slot_playlist( id, slot_id ):
    pass

@app.route( '/editor/<int:id>/slots/<int:slot_id>/set', methods = [ 'POST' ] )
def set_editor_slot_playlist( id, slot_id ):
    pass


# Owner - admins

@app.route( '/owner/admins/list', methods = [ 'GET' ] )
def get_admins():
    pass

@app.route( '/owner/admins/<int:id>/set', methods = [ 'POST' ] )
def set_as_admin( id ):
    pass

@app.route( '/owner/admins/<int:id>/unset', methods = [ 'POST' ] )
def unset_as_admin( id ):
    pass


# Owner - radio station

@app.route( '/owner/station/get', methods = [ 'POST' ] )
def get_station_data():
    pass

@app.route( '/owner/station/edit', methods = [ 'POST' ] )
def edit_station_data():
    pass


# Stats

@app.route( '/stats/wishlist/get', methods = [ 'GET' ] )
def get_wishlist():
    pass

@app.route( '/stats/users/active/count', methods = [ 'GET' ] )
def get_active_users_count():
    pass

@app.route( '/stats/admins/active/list', methods = [ 'GET' ] )
def list_active_admins():
    pass

# @app.route( '/stats/editors/tracks/prefered' )
