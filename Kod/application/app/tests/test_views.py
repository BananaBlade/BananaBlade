import unittest

from app.views import *
from app import app

class TestAuthViews( unittest.TestCase ):

    def setUp( self ):
        self.app = app.test_client()
        self.app.testing = True

    def test_login( self ):
        resp = self.app.post( '/user/auth/login', data = { 'email' : 'mslavkovic@mail.com', 'password_hash' : 'test_hash' }, follow_redirects = True )
        print( resp.status_code, resp.data )

    def test_register( self ):
        resp = self.app.post( '/user/auth/register', data = { 'first_name' : 'Hrvoje', 'last_name' : 'Horvat',
            'occupation' : 'vozač', 'email' : 'hhorvat@mail.com', 'password_hash' : 'pswdhsh' } )
        print( resp.status_code, resp.data )
