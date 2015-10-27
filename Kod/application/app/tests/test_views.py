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
