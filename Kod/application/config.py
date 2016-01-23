import os

APPLICATION_ROOT = '/'

CWD = os.getcwd()

DEBUG = True
TESTING = False

ADMINS = frozenset(['fm.radio.postaja@gmail.com'])
SECRET_KEY = '$j#e&7+*2w2y)0if$c-gvlfs^%@)q)7$(gv@6xk%*^o9r^1u1n'

DATABASE = 'radio.db'

UPLOAD_FOLDER = "static/audio"

MAIL_SERVER = "smtp.gmail.com"
MAIL_PORT = 465
MAIL_USE_SSL = True
MAIL_USERNAME = "fm.radio.postaja"
MAIL_PASSWORD = "FrekvencijskaModulacija"
MAIL_DEFAULT_SENDER = "fm.radio.postaja@gmail.com"
