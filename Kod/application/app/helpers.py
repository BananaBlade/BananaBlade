import mimetypes
import re
import os
import random
import string
import urllib.parse

from binascii import b2a_base64
from datetime import date, datetime, time, timedelta
from hashlib import pbkdf2_hmac, sha256
from werkzeug import secure_filename

from flask import jsonify, request, send_file, Response
from flask.ext.mail import Message

from app.validators import *
from app import app, mail



# Authentication helpers

def generate_random_string( length ):
    """Generate a random string of a given length containing uppercase and lowercase letters, digits and ASCII punctuation."""
    source = string.ascii_lowercase + string.ascii_uppercase + string.digits + string.punctuation
    return ''.join( random.choice( source ) for i in range( length ) )

def hash_password( password, salt ):
    """Returns a password hash made with PBKDF2 algorithm"""
    return b2a_base64( pbkdf2_hmac( 'sha512', password.encode( 'ascii' ), salt.encode( 'ascii' ), 100000 ) ).decode( 'ascii' )

def generate_activation_code( user_id, activation_time ):
    """Generate unique user activagtion code, using user_id and registration_time, but with random elements"""
    uid_hash = b2a_base64( sha256( str( user_id ).encode( 'ascii' ) ).digest() ).decode( 'ascii' )
    act_hash = b2a_base64( sha256( str( activation_time ).encode( 'ascii' ) ).digest() ).decode( 'ascii' )
    rnd_hash = b2a_base64( sha256( str( generate_random_string( 32 ) ).encode( 'ascii' ) ).digest() ).decode( 'ascii' )
    return urllib.parse.quote( urllib.parse.quote( uid_hash + act_hash + rnd_hash, safe = '' ) )[ :256 ]

def generate_filename( filename ):
    """Generate a (probably) unique and definitely secure filename"""
    filename = secure_filename( generate_random_string( 12 ) + '_' + filename )
    validate_filename( filename )
    staticPath = os.path.join( app.config[ 'UPLOAD_FOLDER' ], filename )
    staticPath = os.path.normpath(staticPath)
    absPath = os.path.abspath( staticPath )
    abspath = os.path.normpath(absPath)

    return staticPath, absPath


# Query ranking helpers

def calc_track_score( track, term ):
    """ """
    return ( ( 4 if term in track.title else 0 )
           + ( 3 if term in track.artist else 0 )
           + ( 2 if term in track.album else 0 ) )

def calc_user_score( user, term ):
    """ """
    return ( ( 3 if term in user.last_name else 0 )
           + ( 2 if term in user.first_name else 0 ) )


# Date helpers

def deconstruct_bitmask( bitmask ):
    """Return a list of all bit positions in bitmask"""
    days = [ d if bitmask & ( 1<<d ) else -1 for d in range( 7 ) ]
    return filter( lambda x : x >= 0, days )

def generate_times( time, bitmask, start_date, end_date ):
    """Generate a list of times from a given request"""
    days = list( deconstruct_bitmask( bitmask ) )
    current = datetime.combine( start_date, time )
    end = datetime.combine( end_date, time )
    times = []
    while current <= end:
        if current.weekday() in days:
            times.append( current )
        current += timedelta( days = 1 )
    return times

def datetime_from_string( date_string ):
    """Parse datetime object from a given string formatted as 'yyyy-mm-dd'"""
    return datetime.strptime( date_string, "%Y-%m-%d" )

def is_same_week( date1, date2 ):
    """Checks whether two dates are within the same week"""
    return date1.year == date2.year and date1.strftime( '%W' ) == date2.strftime( '%W' )

def days_names( bitmask ):
    """Returns a string of day names contained in a given bitmask"""
    days = list( deconstruct_bitmask( bitmask ) )
    names = [ 'Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned' ]
    result = [ names[ i ] for i in range( 7 ) if i in days ]
    return ', '.join( result )

# JSON response helpers

def data_response( data, code = 200 ):
    """Returns a JSON response containing `data`, with a given response code"""
    return jsonify( { 'data' : data } ), code

def error_response( message, code = 400 ):
    """Returns a JSON response containing `error_message` with a given error code"""
    return jsonify( { 'error_message' : message } ), code

def success_response( message, code = 200 ):
    """Returns a JSON response containing `success_message` with a given success code"""
    return jsonify( { 'success_message' : message } ), code

def not_implemented_response():
    """Return an error_response indicating functionality is not yet implemented"""
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
    CharValidator( min_length = 6, max_length = 64, message = 'Lozinka nije ispravnog oblika.' ).validate( password )

def validate_equal( password1, password2 ):
    """Simply compares whether two password arguments are the same

    Raises ValueError
    """
    if password1 != password2:
        raise ValueError( 'Lozinke se ne podudaraju.' )

def validate_user_data( first_name, last_name, occupation, year_of_birth, email, password = None, no_password = False ):
    """Combined validator for all user data fields

    Raises ValueError
    """
    CharValidator( min_length = 2, max_length = 64, message = 'Ime nije ispravno.' ).validate( first_name )
    CharValidator( min_length = 2, max_length = 64, message = 'Prezime nije ispravno.' ).validate( last_name )
    CharValidator( min_length = 2, max_length = 64, message = 'Zanimanje nije ispravno.' ).validate( occupation )
    IntValidator( minimum = 1900, maximum = 2100, message = 'Godina rođenja nije ispravna.' ).validate( year_of_birth )
    validate_email( email )
    if not no_password: validate_password( password )

def validate_track_data( title, artist, album, duration, file_format, sample_rate, bits_per_sample,
    genre, publisher, carrier_type, year ):
    """Combined validator for all track data fields

    Only the `title`, `artist` and `duration` are mandatory.

    Raises ValueError
    """
    CharValidator( min_length = 1, max_length = 128, message = 'Naziv zapisa nije ispravan.' ).validate( title )
    CharValidator( min_length = 1, max_length = 128, message = 'Naziv izvođača nije ispravan.' ).validate( artist )
    IntValidator( minimum = 1 ).validate( duration )

    if album is not None:
        CharValidator( min_length = 1, max_length = 64, message = 'Naziv albuma nije ispravan.' ).validate( album )
    if file_format is not None:
        CharValidator( min_length = 3, max_length = 32, message = 'Naziv formata zapisa nije ispravan.' ).validate( file_format )
    if sample_rate is not None:
        FloatValidator( minimum = 8, maximum = 512, message = 'Vrijednost frekvencija uzorkovanja nije ispravna.' ).validate( sample_rate )
    if bits_per_sample is not None:
        IntValidator( minimum = 4, maximum = 512, message = 'Vrijednost broja bitova kvantizacije nije ispravna.' ).validate( bits_per_sample )
    if genre is not None:
        CharValidator( min_length = 2, max_length = 128, message = 'Žanr zapisa nije ispravnog oblika.' ).validate( genre )
    if publisher is not None:
        CharValidator( min_length = 2, max_length = 64, message = 'Naziv izdavača nije ispravan.' ).validate( publisher )
    if carrier_type is not None:
        CharValidator( min_length = 2, max_length = 64, message = 'Vrsta nosača zvuka nije ispravna.' ).validate( carrier_type )
    if year is not None:
        IntValidator( minimum = -5000, maximum = 2100, message = 'Godina izdavanja nije ispravnog oblika.' ).validate( year )


def validate_radio_station_data( name, description, oib, address, email, frequency ):
    """Combined validator for radio station data fields

    Raises ValueError
    """
    CharValidator( min_length = 3, max_length = 64, message = 'Ime postaje nije ispravnog oblika.' ).validate( name )
    OIBValidator().validate( oib )
    CharValidator( min_length = 4, max_length = 128, message = 'Adresa nije ispravna.' ).validate( address )
    EmailValidator().validate( email )
    FloatValidator( minimum = 0.5, maximum = 120, message = 'Vrijednost frekvencije nije ispravna.' ).validate( frequency )


def validate_filename( filename ):
    """Checks whether audio file name is valid ( ie. has correct extension )

    Supported extensions: MP3, WAV, OGG (...)

    Raises ValueError
    """
    valid_extensions = [ 'mp3', 'wav', 'ogg' ]
    if not '.' in filename or filename.rsplit( '.', maxsplit = 1 )[ 1 ] not in valid_extensions:
        raise ValueError( 'Nepodržani nastavak datoteke.' )

#
# # File sending helpers
#
# def send_file_partial( path, request ):
#     """
#         Simple wrapper around send_file which handles HTTP 206 Partial Content
#         (byte ranges)
#     """
#     range_header = request.headers.get( 'Range', None )
#     if not range_header: return send_file( path )
#
#     print( range_header )
#
#     size = os.path.getsize(path)
#     byte1, byte2 = 0, None
#
#     m = re.search('(\d+)-(\d*)', range_header)
#     g = m.groups()
#
#     if g[0]: byte1 = int(g[0])
#     if g[1]: byte2 = int(g[1])
#
#     length = size - byte1
#     if byte2 is not None:
#         length = byte2 - byte1
#
#     data = None
#     with open( path, 'rb' ) as f:
#         f.seek( byte1 )
#         data = f.read(length)
#
#     rv = Response(data,
#         206,
#         mimetype=mimetypes.guess_type(path)[0],
#         direct_passthrough=True)
#     rv.headers.add( 'Content-Range', 'bytes {0}-{1}/{2}'.format(byte1, byte1 + length - 1, size) )
#
#     return rv
