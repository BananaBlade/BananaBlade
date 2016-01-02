import random
import string
import urllib.parse

from binascii import b2a_base64
from hashlib import pbkdf2_hmac, sha256

from flask import jsonify
from flask.ext.mail import Message

from app.validators import *
from app import mail


# TODO: Write a few comments

# Authentication helpers

def generate_random_string( length ):
    """Generate a random string of a given length containing uppercase and lowercase letters, digits and ASCII punctuation."""
    source = string.ascii_lowercase + string.ascii_uppercase + string.digits + string.punctuation
    return ''.join( random.choice( source ) for i in range( length ) )

def hash_password( password, salt ):
    """Returns a password hash made with PBKDF2 algorithm"""
    return b2a_base64( pbkdf2_hmac( 'sha512', password.encode( 'ascii' ), salt.encode( 'ascii' ), 100000 ) ).decode( 'ascii' )

def generate_activation_code( user_id, activation_time ):
    """TODO: Come up with a way to generate unique activation code for each user_id
    and registration_time, but with random elements"""
    uid_hash = b2a_base64( sha256( str( user_id ).encode( 'ascii' ) ).digest() ).decode( 'ascii' )
    act_hash = b2a_base64( sha256( str( activation_time ).encode( 'ascii' ) ).digest() ).decode( 'ascii' )
    rnd_hash = b2a_base64( sha256( str( generate_random_string( 32 ) ).encode( 'ascii' ) ).digest() ).decode( 'ascii' )
    return urllib.parse.quote( urllib.parse.quote( uid_hash + act_hash + rnd_hash, safe = '' ) )[ :256 ]


# JSON response helpers

def data_response( data, code = 200 ):
    """ """
    return jsonify( { 'data' : data } ), code

def error_response( message, code = 400 ):
    """ """
    return jsonify( { 'error_message' : message } ), code

def success_response( message, code = 200 ):
    """ """
    return jsonify( { 'success_message' : message } ), code

def not_implemented_response():
    """ """
    return error_response( 'Funkcija još nije implementirana', 501 )


# Mail helpers

def send_mail( title, content, sender, recipient ):
    """Sends an email using Flask-Mail extension via GMail SMTP server

    Mail configuration is in app config file.

    Raises BadHeaderError (and some others perhaps)
    """
    message = Message( title, sender = sender, recipients = [ recipient ], charset = 'UTF8' )
    message.html = content
    mail.send( message )


# Validation helpers

def validate_email( email ):
    """Validates an email address argument with a default Regex pattern

    Raises ValueError
    """
    EmailValidator().validate( email )

def validate_password( password ):
    """Validates a password argument - tests whether length is within (6, 64)

    Raises ValueError
    """
    CharValidator( min_length = 6, max_length = 64 ).validate( password )

def validate_equal( password1, password2 ):
    """Simply compares whether two password arguments are the same

    Raises ValueError
    """
    if password1 != password2:
        raise ValueError( 'Lozinke se ne podudaraju' )

def validate_user_data( first_name, last_name, email, year_of_birth, occupation, password ):
    """Combined validator for all user data fields

    Raises ValueError
    """
    CharValidator( min_length = 2, max_length = 64 ).validate( first_name )
    CharValidator( min_length = 2, max_length = 64 ).validate( last_name )
    CharValidator( min_length = 2, max_length = 64 ).validate( occupation )
    IntValidator( minimum = 1900, maximum = 2100 ).validate( year_of_birth )
    validate_email( email )
    validate_password( password )


def validate_track_data( title, artist, album, duration, file_format, sample_rate, bits_per_sample,
    genre, publisher, carrier_type, year ):
    """Combined validator for all track data fields

    Raises ValueError
    """
    CharValidator( min_length = 1, max_length = 128 ).validate( title )
    CharValidator( min_length = 1, max_length = 128 ).validate( artist )
    CharValidator( min_length = 1, max_length = 64 ).validate( album )
    IntValidator( minimum = 1 ).validate( duration )
    CharValidator( min_length = 3, max_length = 32 ).validate( file_format )
    FloatValidator( minimum = 8, maximum = 512 ).validate( sample_rate )
    IntValidator( minimum = 4, maximum = 512 ).validate( bits_per_sample )
    CharValidator( min_length = 2, max_length = 128 ).validate( genre )
    CharValidator( min_length = 2, max_length = 64 ).validate( publisher )
    CharValidator( min_length = 2, max_length = 64 ).validate( carrier_type )
    IntValidator( minimum = -5000, maximum = 2100 ).validate( year )


def validate_radio_station_data( name, oib, address, email, frequency ):
    """Combined validator for radio station data fields

    Raises ValueError
    """
    CharValidator( min_length = 3, max_length = 64 ).validate( name )
    OIBValidator().validate( oib )
    CharValidator( min_length = 4, max_length = 128 ).validate( address )
    EmailValidator().validate( email )
    FloatValidator( minimum = 0.5, maximum = 120 ).validate( frequency )


def validate_filename( filename ):
    """Checks whether audio file name is valid ( ie. has correct extension )

    Supported extensions: MP3, WAV, OGG (...)

    Raises ValueError
    """
    valid_extensions = [ 'mp3', 'wav', 'ogg' ]
    if not '.' in filename or filename.rsplit( '.', maxsplit = 1 )[ 1 ] not in valid_extensions:
        raise ValueError( 'Nepodržani nastavak datoteke' )
