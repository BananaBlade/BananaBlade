from flask import jsonify
from app.validators import *


# TODO: Write a few comments

# Authentication helpers

def generate_activation_code( user_id, activation_time ):
    """TODO: Come up with a way to generate unique activation code for each user_id
    and registration_time, but with random elements"""
    return str( user_id ).rjust( 64, 'A' )


# JSON response helpers

def data_response( data, code = 200 ):
    return jsonify( { 'data' : data } ), code

def error_response( message, code = 400 ):
    return jsonify( { 'error_message' : message } ), code

def success_response( message, code = 200 ):
    return jsonify( { 'success_message' : message } ), code

def not_implemented_response():
    return error_response( 'Funkcija još nije implementirana', 501 )


# Validation helpers

def validate_email( email ):
    """ """
    EmailValidator().validate( email )

def validate_password_hash( password_hash ):
    """ """
    CharValidator( min_length = 64, max_length = 64 ).validate( password_hash )


def validate_user_data( first_name, last_name, email, year_of_birth, occupation, password_hash = 0 ):
    """Combined validator for all user data fields

    Note: `password_hash` is by default set to 0, which is int and not a string,
    so it could be recognized when function is called with `password_hash` equal
    to None - say, when it wasn't provided in the request, but it should have been.

    Raises ValueError
    """
    CharValidator( min_length = 2, max_length = 64 ).validate( first_name )
    CharValidator( min_length = 2, max_length = 64 ).validate( last_name )
    CharValidator( min_length = 2, max_length = 64 ).validate( occupation )
    IntValidator( minimum = 1900, maximum = 2100 ).validate( year_of_birth )
    validate_email( email )
    if password_hash != 0: validate_password_hash( password_hash )


def validate_track_data( title, artist, album, duration, file_format, sample_rate, bits_per_sample,
    genre, publisher, carrier_type, year ):
    """TODO: Implement"""
    pass


def validate_filename( filename ):
    """Checks whether audio file name is valid ( ie. has correct extension )

    Supported extensions: MP3, WAV, OGG (...)
    TODO: Implement
    """
    pass
