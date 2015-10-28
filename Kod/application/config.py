import os

APPLICATION_ROOT = os.path.dirname( os.path.realpath( __file__ ) )

DEBUG = True

ADMINS = frozenset(['youremail@yourdomain.com'])
SECRET_KEY = '$j#e&7+*2w2y)0if$c-gvlfs^%@)q)7$(gv@6xk%*^o9r^1u1n'
# TODO: Hide app secret key on deployment

DATABASE = 'sartz.db'

WTF_CSRF_ENABLED = True
WTF_CSRF_SECRET_KEY = "somethingimpossibletoguess"
