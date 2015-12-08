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


# User auth routes

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


# User account routes

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
