import os

APPLICATION_ROOT = os.path.dirname( os.path.realpath( __file__ ) )
CDN_ROOT = os.path.join( os.path.dirname( os.path.realpath( __file__ ) ).rsplit( '/', maxsplit = 1 )[ 0 ], 'frontend/dest' )

DEBUG = True
TESTING = False

ADMINS = frozenset(['youremail@yourdomain.com'])
SECRET_KEY = '$j#e&7+*2w2y)0if$c-gvlfs^%@)q)7$(gv@6xk%*^o9r^1u1n'
# TODO: Hide app secret key on deployment

DATABASE = 'radio.db'

WTF_CSRF_ENABLED = True
WTF_CSRF_SECRET_KEY = "somethingimpossibletoguess"

UPLOAD_FOLDER = "/static/audio"

MAIL_SERVER = "smtp.gmail.com"
MAIL_PORT = 465
MAIL_USE_SSL = True
MAIL_USERNAME = "fm.radio.postaja"
MAIL_PASSWORD = "FrekvencijskaModulacija"
MAIL_DEFAULT_SENDER = "fm.radio.postaja@gmail.com"
