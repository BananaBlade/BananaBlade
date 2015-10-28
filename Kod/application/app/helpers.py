from flask import jsonify

def generate_activation_code( user_id ):
    return str( user_id ).rjust( 64, 'A' )

def error_response( message, code = 500 ):
    return jsonify( { 'error_message' : message } ), code

def success_response( message ):
    return jsonify( { 'success_message' : message } ), 200
