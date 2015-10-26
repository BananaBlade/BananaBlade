import unittest

from app.models import *

class TestTrackCRUD( unittest.TestCase ):

    def test_add_track( self ):
        track = Track.add_track( name = 'Test Track', artist = 'Mirko', album = 'Best of Mirko', duration = 3*60+12, file_format = 'MP3' )
        self.assertEqual( track.name, 'Test Track' )
        self.assertEqual( track.artist, 'Mirko' )
        self.assertEqual( track.album, 'Best of Mirko' )
        self.assertEqual( track.duration, 192 )
        self.assertEqual( track.file_format, 'MP3' )

    def test_remove_track( self ):
        pass

def run_tests():
    unittest.main()
