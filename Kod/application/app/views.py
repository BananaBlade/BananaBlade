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

@app.route( '/admin/editors/<int:id>/slots/assign/<int:slot_id>', methods = [ 'POST' ] )
def assign_slot_to_editor( id, slot_id ):
    pass

@app.route( '/admin/editors/<int:id>/slots/unassign/<int:slot_id>', methods = [ 'POST' ] )
def unassign_slot_to_editor( id, slot_id ):
    pass

# # Owner-specific routes
#
# @app.route( '/owner/admins/add', methods = [ 'POST' ] )
# def process_admin_adding():
#     pass
#
# @app.route( '/owner/admins/<int:id>/remove', methods = [ 'POST' ] )
# def process_admin_removal():
#     pass
