import unittest

from app.models import *

class TestTrackCRUD( unittest.TestCase ):

    def setUp( self ):
        track = Track.add_track( name = 'tt1', path = '/tracks/test.mp3',
            artist = 'Mirko', album = 'Best of Mirko', duration = 3*60+12,
            file_format = 'MP3', genre = 'Turbo Folk', year = 1984 )

    def tearDown( self ):
        Track.get( Track.name == 'tt1' ).delete_instance()

    def test_add_track( self ):
        track = Track.add_track( name = 'Test Track', path = '/tracks/test.mp3',
            artist = 'Mirko', album = 'Best of Mirko', duration = 3*60+12,
            file_format = 'MP3', genre = 'Turbo Folk', year = 1984 )
        self.assertEqual( track.name, 'Test Track' )
        self.assertEqual( track.path, '/tracks/test.mp3' )
        self.assertEqual( track.artist, 'Mirko' )
        self.assertEqual( track.album, 'Best of Mirko' )
        self.assertEqual( track.duration, 192 )
        self.assertEqual( track.file_format, 'MP3' )

    def test_edit_track( self ):
        track = Track.get( Track.name == 'tt1' )
        Track.edit_track( track.id, album = 'Greatest hits' )
        track = Track.get( Track.name == 'tt1' )
        self.assertEqual( track.album, 'Greatest hits' )

    def test_delete_track( self ):
        track = Track.get( Track.name == 'Test Track' )
        Track.delete_track( track.id )

def run_model_tests():
    unittest.main()
