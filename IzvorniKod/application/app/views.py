from app import app

from flask import g, redirect, render_template, session

# Pre-request setup

@app.before_request
def preprocess_request():
    """Before processing each request, make the current user available to everyone via flask g object"""
    g.user = User.get( User.id == session[ 'user_id' ] ) if 'user_id' in session else None


# Main views

@app.route( '/' )
def show_index():
    return 'Hello'

@app.route( '/settings' ):
def show_settings():
    pass

# Basic authentication & user management routes

@app.route( '/users/login', methods = [ 'POST' ] )
def process_login():
    pass

@app.route( '/users/register', methods = [ 'POST' ] )
def process_register():
    pass

@app.route( '/users/activate', methods = [ 'GET' ] )
def process_account_activation():
    pass

@app.route( '/users/change-password', methods = [ 'POST' ] )
def process_password_change():
    pass

@app.route( '/users/modify-account-data', methods = [ 'POST' ] )
def process_account_data_modifications():
    pass

# Admin-specific routes

@app.route( '/admin/editors/add', methods = [ 'POST' ] )
def process_editor_adding():
    pass

@app.route( '/admin/editors/<int:id>/remove', methods = [ 'POST' ] )
def process_editor_removal( id ):
    pass

@app.route( '/admin/schedule/modify', methods = [ 'POST' ] )
def process_schedule_modifications():
    pass

@app.route( '/admin/tracks/add', methods = [ 'POST' ] )
def process_track_adding():
    pass

@app.route( '/admin/tracks/<int:id>/edit', methods = [ 'POST' ] )
def process_track_editing( id ):
    pass

@app.route( '/admin/tracks/<int:id>remove', methods = [ 'POST' ] )
def process_track_removal( id ):
    pass

# Editor-specific routes



# Owner-specific routes

@app.route( '/owner/admins/add', methods = [ 'POST' ] )
def process_admin_adding():
    pass

@app.route( '/owner/admins/<int:id>/remove', methods = [ 'POST' ] )
def process_admin_removal():
    pass
