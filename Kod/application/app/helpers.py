from flask import jsonify

def generate_activation_code( user_id, activation_time ):
    """Come up with a way to generate unique activation code for each user id"""
    return str( user_id ).rjust( 64, 'A' )

def data_response( data, code = 200 ):
    return jsonify( { 'data' : data } ), code

def error_response( message, code = 400 ):
    return jsonify( { 'error_message' : message } ), code

def success_response( message, code = 200 ):
    return jsonify( { 'success_message' : message } ), code

def not_implemented_response():
    return error_response( 'Funkcija još nije implementirana', 501 )
