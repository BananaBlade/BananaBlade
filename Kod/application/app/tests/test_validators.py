import unittest

from app.validators import *

class TestValidators( unittest.TestCase ):

    def test_char_validator( self ):
        self.assertRaises( ValueError, CharValidator( max_length = 64, min_length = 2 ).validate( 'e' ) )
