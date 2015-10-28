from functools import wraps
from flask import g, request, redirect, url_for

from app.definitions import *
from app.helpers import *

def login_required( f ):
    @wraps( f )
    def decorated_function( *args, **kwargs ):
        if g.user is None:
            return error_response( 'Neovlašten pristup', 401 )
        return f( *args, **kwargs )
    return decorated_function
