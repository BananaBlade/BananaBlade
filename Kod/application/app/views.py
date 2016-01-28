import itertools
import os
import urllib.parse

from datetime import date, datetime, time
from flask import g, redirect, request, render_template, send_file, send_from_directory, session
from peewee import DoesNotExist

from app import app
from app.decorators import *
from app.helpers import *
from app.models import *
from app.validators import CharValidator, EmailValidator


# Hooks setup

@app.before_request
def preprocess_request():
    """Before processing each request, make the current user available to everyone via flask g object,
    and store activity time"""
    db.connect()
    g.user = User.get( User.id == int( session[ 'user_id' ] ) ) if 'user_id' in session else None
    if g.user is not None: g.user.update_activity()


@app.after_request
def add_header( response ):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to prevent caching pages.
    """
    db.close()
    response.headers[ 'X-UA-Compatible' ] = 'IE=Edge,chrome=1'
    response.headers[ 'Cache-Control' ] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0'
    response.headers[ 'Pragma' ] = 'no-cache'
    response.headers[ 'Expires' ] = '-1'
    response.headers[ 'Accept-Ranges' ] = 'bytes'
    return response

# Display routes

@app.route( '/' )
def show_index():
    """Displays the index page"""
    return render_template( 'index.html' )


# Player routes

@app.route( '/player/get', methods = [ 'GET' ] )
def get_currently_playing_track():
    """Returns currently playing track as a file

    No request params.
    """
    try:
        pt, _, _ = Track.get_currently_playing()
        path = pt.track.path
        return send_file( os.path.join( '..', path ) )
    except DoesNotExist:
        return error_response( 'Nije moguće dohvatiti trenutno svirani zapis: Trenutno se ne emitira ništa.', 404 )
    except IndexError:
        return error_response( 'Nije moguće dohvatiti trenutno svirani zapis: Lista za reprodukciju je završila prije vremena.', 404 )
    except:
        return error_response( 'Nije moguće dohvatiti trenutno svirani zapis.', 404 )

@app.route( '/player/info', methods = [ 'GET' ] )
def get_currently_playing_track_info():
    """Returns informations about the currently playing track

    No request params.
    """
    try:
        pt, time, editor = Track.get_currently_playing()
        track = pt.track
        data = {
            'id'                : track.id,
            'play_location'     : time,
            'play_duration'     : pt.play_duration,
            'title'             : track.title,
            'artist'            : track.artist,
            'album'             : track.album,
            'genre'             : track.genre,
            'publisher'         : track.publisher,
            'year'              : track.year,
            'editor'            : editor.first_name + ' ' + editor.last_name
        }
        return data_response( data )
    except DoesNotExist:
        return error_response( 'Nije moguće dohvatiti podatke o trenutno sviranom zapisu: Trenutno se ne emitira ništa.', 404 )
    except IndexError:
        return error_response( 'Nije moguće dohvatiti podatke o trenutno sviranom zapisu: Lista za reprodukciju je završila prije vremena.', 404 )
    except:
        return error_response( 'Nije moguće dohvatiti podatke o trenutno sviranom zapisu.', 404 )

@app.route( '/player/location', methods = [ 'GET' ] )
def get_currently_playing_track_location():
    """ """
    try:
        _, time, _ = Track.get_currently_playing()
        return data_response( { 'play_location' : time } )
    except DoesNotExist:
        return error_response( 'Nije moguće dohvatiti podatke o trenutno sviranom zapisu: Trenutno se ne emitira ništa.', 404 )
    except IndexError:
        return error_response( 'Nije moguće dohvatiti podatke o trenutno sviranom zapisu: Lista za reprodukciju je završila prije vremena.', 404 )
    except:
        return error_response( 'Nije moguće dohvatiti podatke o trenutno sviranom zapisu.', 404 )

@app.route( '/player/schedule', methods = [ 'GET' ] )
def get_next_on_schedule():
    """Returns a list of current and 6 next assigned slots

    No request params.
    """
    try:
        data = [{
            'time'      :   slot.time.strftime( '%H:%M' ),
            'editor'    :   slot.editor.first_name + ' ' + slot.editor.last_name
        } for slot in Slot.get_next_on_schedule() ]
        return data_response( data )
    except:
        return error_response( 'Nije moguće dohvatiti raspored emitiranja.' )


# User auth

@app.route( '/user/auth/login', methods = [ 'POST' ] )
def process_login():
    """Process user login

    Request should contain `email` and `password` arguments.
    """
    email           = request.values.get( 'email' )
    password        = request.values.get( 'password' )

    try:
        EmailValidator().validate( email )
        validate_password( password )
        user = User.authenticate_user( email, password )
        session[ 'user_id' ] = user.id
        return success_response( 'Uspješna prijava.' )
    except ValueError as e:
        return error_response( 'Prijava neuspješna: Uneseni su neispravni podaci: ' + str( e ) )
    except DoesNotExist:
        return error_response( 'Prijava neuspješna: Ne postoji korisnik s danom email adresom.', 404 )
    except AuthenticationError as e:
        return error_response( 'Prijava neuspješna: ' + str( e ) )
    except:
        return error_response( 'Prijava neuspješna: Nevaljan zahtjev.' )

@app.route( '/user/auth/register', methods = [ 'POST' ] )
def process_registration():
    """Process user registration

    Request should contain `first_name`, `last_name`, `email`, `occupation`,
    `year_of_birth` and `password` arguments.
    """
    first_name      = request.values.get( 'first_name' )
    last_name       = request.values.get( 'last_name' )
    occupation      = request.values.get( 'occupation' )
    year_of_birth   = request.values.get( 'year_of_birth' )
    email           = request.values.get( 'email' )
    password        = request.values.get( 'password' )
    password2       = request.values.get( 'password2' )

    if year_of_birth is not None: year_of_birth = int( year_of_birth )

    try:
        validate_user_data( first_name, last_name, occupation, year_of_birth, email, password )
        validate_equal( password, password2 )
        user = User.create_user( first_name, last_name, occupation, year_of_birth, email, password )

        rs = RadioStation.get()
        body = render_template( 'mail/activate.html', activation_code = user.activation_code )
        send_mail( '{} - Aktivacija korisničkog računa'.format( rs.name ), body, rs.email, recipient = user.email )

        return success_response( 'Registracija uspješna; Na email adresu je poslan aktivacijski link.', 201 )
    except ValueError as e:
        return error_response( 'Registracija neuspješna: Uneseni su neispravni podaci: ' + str( e ) )
    except peewee.IntegrityError:
        return error_response( 'Registracija neuspješna: Već postoji korisnik s danom email adresom.', 409 )
    except:
        return error_response( 'Registracija neuspješna: Nevaljan zahtjev.' )

@app.route( '/user/auth/activate/<activation_code>', methods = [ 'GET' ] )
def process_activation( activation_code ):
    """Process account activation

    No request params, `activation_code` obtained from the URL
    """
    try:
        User.activate_user( urllib.parse.quote( activation_code ) )
        return render_template( 'message_response.html', message = { 'type' : 'success', 'title' : 'Račun aktiviran',
            'text' : 'Vaš korisnički račun uspješno je aktiviran i sada se možete prijavljivati u sustav.' } )
    except DoesNotExist:
        return render_template( 'message_response.html', message = { 'type' : 'error', 'title' : 'Neuspješna aktivacija računa',
            'text' : 'Ne postoji korisnički račun s danim aktivacijskim kodom, provjerite jeste li kliknuli na ispravnu poveznicu.' } ), 404
    except ValueError as e:
        return render_template( 'message_response.html', message = { 'type' : 'error', 'title' : 'Neuspješna aktivacija računa',
        'text' : 'Vaš korisnički račun već je aktiviran.'} ), 400

@app.route( '/user/auth/signout', methods = [ 'GET' ] )
@login_required
def process_signout():
    """Process user signout

    No request params.
    After signing out, user is redirected to the index page.
    """
    session.clear()
    #return redirect( '/' )
    return success_response( 'Uspješna odjava.' )


# User account management

@app.route( '/user/account/type', methods = [ 'GET' ] )
def get_account_type():
    """Return user account type

    No request params.
    """
    data = { 'account_type' : g.user.account_type if g.user is not None else 0 }
    return data_response( data )

@app.route( '/user/account/get', methods = [ 'GET' ] )
@login_required
def get_account_data():
    """Return user account data

    No request params.
    """
    data = {
        'id'            :   g.user.id,
        'first_name'    :   g.user.first_name,
        'last_name'     :   g.user.last_name,
        'email'         :   g.user.email,
        'year_of_birth' :   g.user.year_of_birth,
        'occupation'    :   g.user.occupation,
        'account_type'  :   g.user.account_type
    }
    return data_response( data )

@app.route( '/user/account/modify', methods = [ 'POST' ] )
@login_required
def modify_account_data():
    """Change user account data

    Request should contain `first_name`, `last_name`, `email`, `occupation` and
    `year_of_birth`.
    """
    first_name      = request.values.get( 'first_name' )
    last_name       = request.values.get( 'last_name' )
    email           = request.values.get( 'email' )
    year_of_birth   = request.values.get( 'year_of_birth' )
    occupation      = request.values.get( 'occupation' )

    if year_of_birth is not None: year_of_birth = int( year_of_birth )

    try:
        validate_user_data( first_name, last_name, occupation, year_of_birth, email, no_password = True )
        g.user.modify_account( first_name, last_name, occupation, year_of_birth, email )
        return success_response( 'Korisnički podaci uspješno promjenjeni.' )
    except ValueError as e:
        return error_response( 'Promjena podataka nije uspjela: Nisu uneseni ispravni podaci: ' + str( e ) )
    except peewee.IntegrityError:
        return error_response( 'Promjena podataka nije uspjela: Email adresa se već koristi.', 409 )
    except Exception as e:
        print(e)
        return error_response( 'Promjena podataka nije uspjela: Nevaljan zahtjev.' )

@app.route( '/user/account/delete', methods = [ 'POST' ] )
@login_required
def delete_account():
    """Deletes current user's account

    Request should contain `password`.
    """
    password = request.values.get( 'password' )

    try:
        g.user.delete_account( password )
        session.clear()
        return success_response( 'Korisnički račun uspješno izbrisan.' )
    except AuthenticationError:
        return error_response( 'Brisanje računa nije uspjelo: Nije unesena ispravna lozinka.', 403 )
    except DoesNotExist:
        return error_response( 'Brisanje računa nije uspjelo: Korisnički račun ne postoji.', 410 )
    except:
        return error_response( 'Brisanje računa nije uspjelo: Nevaljan zahtjev.' )

@app.route( '/user/account/change_password', methods = [ 'POST' ] )
@login_required
def change_account_password():
    """Changes user account password

    Request should contain `old_password`, `new_password` and `new_password2`.
    """
    old_password    = request.values.get( 'old_password' )
    new_password1   = request.values.get( 'new_password1' )
    new_password2   = request.values.get( 'new_password2' )

    try:
        validate_password( new_password1 )
        validate_equal( new_password1, new_password2 )
        g.user.change_password( old_password, new_password1 )
        return success_response( 'Lozinka uspješno promjenjena.' )
    except AuthenticationError:
        return error_response( 'Promjena lozinke nije uspjela: Stara lozinka nije ispravna.' )
    except ValueError as e:
        return error_response( 'Promjena lozinke nije uspjela: ' + str( e ) )
    except:
        return error_response( 'Promjena lozinke nije uspjela: Nevaljan zahtjev.' )


# User wishlist management

@app.route( '/user/wishlist/get', methods = [ 'GET' ] )
@login_required
def get_wishlist():
    """Returns user's private wishlist

    Returns a list of up to 10 dicts { id, title, artist, album, duration, genre, year }
    describing tracks on user's wishlist.

    No request params.
    """
    try:
        wishlist = g.user.get_wishlist()
        data = [{
            'id'        : wish.id,
            'title'     : wish.track.title,
            'artist'    : wish.track.artist,
            'album'     : wish.track.album,
            'duration'  : wish.track.duration,
            'genre'     : wish.track.genre,
            'year'      : wish.track.year
        } for wish in wishlist ]
        return data_response( data )
    except AuthorizationError:
        return error_response( 'Listu želja nije moguće dohvatiti: Nedozvoljena mogućnost.', 403 )
    except:
        return error_response( 'Listu želja nije moguće dohvatiti: Nevaljan zahtjev.' )

@app.route( '/user/wishlist/can_confirm', methods = [ 'GET' ] )
@login_required
def get_wishlist_confirmation_time():
    """Return whether user can confirm his wishlist or not

    No request params.
    """
    try:
        confirmation_time = g.user.get_wishlist_confirmation_time()
        can_confirm = datetime.now() - confirmation_time > timedelta( days = 1 ) if confirmation_time is not None else True
        return data_response( { 'can_confirm' : can_confirm } )
    except AuthorizationError:
        return error_response( 'Neuspješno dohvaćanje vremena zadnjeg potvrđivanja: Nedozvoljena mogućnost.', 403 )
    # except:
    #     return error_response( 'Neuspješno dohvaćanje vremena zadnjeg potvrđivanja.' )

@app.route( '/user/wishlist/set', methods = [ 'POST' ] )
@login_required
def set_wishlist():
    """Sets user's wishlist

    Request should contain a list of up to 10 track_id's, of tracks to be placed
    on the user's wishlist. Parameters are JSON-encoded.
    """
    try:
        track_list = request.get_json( force = True )
        g.user.set_wishlist( track_list )
        return success_response( 'Lista želja uspješno pohranjena.', 201 )
    except AuthorizationError:
        return error_response( 'Listu želja nije moguće pohraniti: Nedozvoljena mogućnost.', 403 )
    except:
        return error_response( 'Listu želja nije moguće pohraniti: Nevaljan zahtjev.' )

@app.route( '/user/wishlist/confirm', methods = [ 'POST' ] )
@login_required
def confirm_wishlist():
    """Confirms user's wishlist

    No request params.
    """
    try:
        g.user.confirm_wishlist()
        return success_response( 'Lista želja uspješno potvrđena.' )
    except AuthorizationError:
        return error_response( 'Listu želja nije moguće potvrditi: Nedozvoljena mogućnost.', 403 )
    except EnvironmentError:
        return error_response( 'Listu želja nije moguće potvrditi: To je već učinjeno unutar proteklih 24 sata.', 409 )
    except:
        return error_response( 'Listu želja nije moguće potvrditi: Nevaljan zahtjev.' )


# Admin track management

@app.route( '/admin/tracks/upload', methods = [ 'POST' ] )
@login_required
def upload_track():
    """Uploads a track file onto the server and returns uploaded file path

    Request should contain a `file` for upload.
    """

    audio_file = request.files.get( 'file' )

    try:
        g.user._assert_admin()
        staticPath, absPath = generate_filename( audio_file.filename )

        audio_file.save( absPath )

        return data_response( { 'path' : staticPath }, 201 )

    except AuthorizationError:
        return error_response( 'Dodavanje zapisa nije uspjelo: Nedovoljne ovlasti.', 403 )
    except ValueError as e:
        return error_response( 'Dodavanje zapisa nije uspjelo: Nisu uneseni ispravni podaci: ' + str( e ) )
    except Exception:
        return error_response( 'Dodavanje zapisa nije uspjelo: Nevaljan zahtjev.' )



@app.route( '/admin/tracks/add', methods = [ 'POST' ] )
@login_required
def add_track():
    """Adds a new track with its metadata

    Request should contain track metadata: `title`, `artist`, `album`, `duration`,
    `file_format`, `sample_rate`, `bits_per_sample`, `genre`, `publisher`,
    `carrier_type`, `year`, and `path` of a file previously stored on the server.

    TODO: Extensive testing!!

    """
    title           = request.values.get( 'title' )
    artist          = request.values.get( 'artist' )
    album           = request.values.get( 'album' )
    duration        = request.values.get( 'duration' )
    file_format     = request.values.get( 'file_format' )
    sample_rate     = request.values.get( 'sample_rate' )
    bits_per_sample = request.values.get( 'bits_per_sample' )
    genre           = request.values.get( 'genre' )
    publisher       = request.values.get( 'publisher' )
    carrier_type    = request.values.get( 'carrier_type' )
    year            = request.values.get( 'year' )
    path            = request.values.get( 'path' )

    if duration is not None: duration = int( duration )
    if sample_rate is not None: sample_rate = float( sample_rate )
    if bits_per_sample is not None: bits_per_sample = int( bits_per_sample )
    if year is not None: year = int( year )

    try:
        validate_track_data( title, artist, album, duration, file_format, sample_rate,
            bits_per_sample, genre, publisher, carrier_type, year )

        g.user.add_track( title = title, path = path, artist = artist, album = album, duration = duration,
            file_format = file_format, sample_rate = sample_rate, bits_per_sample = bits_per_sample,
            genre = genre, publisher = publisher, carrier_type = carrier_type, year = year )
        return success_response( 'Zvučni zapis uspješno dodan.', 201 )
    except AuthorizationError:
        return error_response( 'Dodavanje zapisa nije uspjelo: Nedovoljne ovlasti.', 403 )
    except ValueError as e:
        return error_response( 'Dodavanje zapisa nije uspjelo: Nisu uneseni ispravni podaci: ' + str( e ) )
    except:
        return error_response( 'Dodavanje zapisa nije uspjelo: Nevaljan zahtjev.' )

@app.route( '/admin/tracks/<int:track_id>/get', methods = [ 'GET' ] )
@login_required
def get_track( track_id ):
    """Returns data of a track having `track_id`

    No request params.
    """
    try:
        track = g.user.get_track( track_id )
        data = {
            'title'             : track.title,
            'path'              : track.path,
            'artist'            : track.artist,
            'album'             : track.album,
            'genre'             : track.genre,
            'year'              : track.year,
            'duration'          : track.duration,
            'file_format'       : track.file_format,
            'sample_rate'       : track.sample_rate,
            'bits_per_sample'   : track.bits_per_sample,
            'publisher'         : track.publisher,
            'carrier_type'      : track.carrier_type
        }
        return data_response( data )
    except AuthorizationError:
        return error_response( 'Neuspješno dohvaćanje podataka o zapisu: Nedovoljne ovlasti.', 403 )
    except DoesNotExist:
        return error_response( 'Neuspješno dohvaćanje podataka o zapisu: Ne postoji zapis s danim ID-om.', 404 )
    except:
        return error_response( 'Neuspješno dohvaćanje podataka o zapisu.' )

@app.route( '/admin/tracks/<int:track_id>/edit', methods = [ 'POST' ] )
@login_required
def edit_track( track_id ):
    """Adds a new track with its metadata

    Request should contain track metadata: `title`, `artist`, `album`, `duration`,
    `file_format`, `sample_rate`, `bits_per_sample`, `genre`, `publisher`,
    `carrier_type`, `year`
    """
    title           = request.values.get( 'title' )
    artist          = request.values.get( 'artist' )
    album           = request.values.get( 'album' )
    duration        = request.values.get( 'duration' )
    file_format     = request.values.get( 'file_format' )
    sample_rate     = request.values.get( 'sample_rate' )
    bits_per_sample = request.values.get( 'bits_per_sample' )
    genre           = request.values.get( 'genre' )
    publisher       = request.values.get( 'publisher' )
    carrier_type    = request.values.get( 'carrier_type' )
    year            = request.values.get( 'year' )

    if duration is not None: duration = int( duration )
    if sample_rate is not None: sample_rate = float( sample_rate )
    if bits_per_sample is not None: bits_per_sample = int( bits_per_sample )
    if year is not None: year = int( year )

    try:
        validate_track_data( title, artist, album, duration, file_format, sample_rate,
            bits_per_sample, genre, publisher, carrier_type, year )
        g.user.edit_track( track_id, title = title, artist = artist, album = album, duration = duration,
            file_format = file_format, sample_rate = sample_rate, bits_per_sample = bits_per_sample,
            genre = genre, publisher = publisher, carrier_type = carrier_type, year = year )
        return success_response( 'Podaci o zvučnom zapisu uspješno promjenjeni.' )
    except AuthorizationError:
        return error_response( 'Promjena podataka nije uspjela: Nedovoljne ovlasti.', 403 )
    except DoesNotExist:
        return error_response( 'Promjena podataka nije uspjela: Ne postoji zvučni zapis s danim ID-om.', 404 )
    except ValueError as e:
        return error_response( 'Promjena podataka nije uspjela: Nisu uneseni ispravni podaci: ' + str( e ) )
    except:
        return error_response( 'Promjena podataka nije uspjela: Nevaljan zahtjev.' )

@app.route( '/admin/tracks/<int:track_id>/delete', methods = [ 'POST' ] )
@login_required
def delete_track( track_id ):
    """Deletes track and its metadata

    No request params.
    """
    try:
        path = Track.get( Track.id == track_id ).path
        os.remove( path )
        g.user.remove_track( track_id )
        return success_response( 'Zvučni zapis uspješno izbrisan.' )
    except AuthorizationError:
        return error_response( 'Brisanje nije uspjelo: Nedovoljne ovlasti.', 403 )
    except DoesNotExist:
        return error_response( 'Brisanje nije uspjelo: Ne postoji zvučni zapis s danim ID-om.', 404 )
    except OSError:
        return error_response( 'Brisanje nije uspjelo: Greška u sustavu.' )
    except:
        return error_response( 'Brisanje nije uspjelo: Nevaljan zahtjev.' )


# Admin editors management

@app.route( '/admin/editors/list', methods = [ 'GET' ] )
@login_required
def list_editors():
    """Returns a list of all editors

    Returns a list of dicts { id, first_name, last_name, email } representing
    individual editors.
    No request params.
    """
    try:
        editors = g.user.get_all_editors()
        data = [{
            'id'            : editor.id,
            'first_name'    : editor.first_name,
            'last_name'     : editor.last_name,
            'occupation'    : editor.occupation,
            'year_of_birth' : editor.year_of_birth,
            'email'         : editor.email
        } for editor in editors ]
        return data_response( data )
    except AuthorizationError:
        return error_response( 'Dohvaćanje popisa nije uspjelo: Nedovoljne ovlasti.', 403 )
    except:
        return error_response( 'Dohvaćanje popisa nije uspjelo.' )

@app.route( '/admin/editors/add/<int:user_id>', methods = [ 'POST' ] )
@login_required
def add_editor( user_id ):
    """Adds editorial privileges to user with `user_id`

    No request params.
    """
    try:
        g.user.add_editor( user_id )
        return success_response( 'Korisnik uspješno postavljen za urednika.' )
    except AuthorizationError:
        return error_response( 'Neuspješno postavljanje urednika: Nedovoljne ovlasti.', 403 )
    except DoesNotExist:
        return error_response( 'Neuspješno postavljanje urednika: Ne postoji korisnik s danim ID-om.', 404 )
    except TypeError as e:
        return error_response( 'Neuspješno postavljanje urednika: ' + str( e ) )
    except:
        return error_response( 'Neuspješno postavljanje urednika: Nevaljan zahtjev.' )

@app.route( '/admin/editors/remove/<int:editor_id>', methods = [ 'POST' ] )
@login_required
def remove_editor( editor_id ):
    """Revokes editorial privileges from user with `user_id`

    No request params.
    """
    try:
        g.user.remove_editor( editor_id )
        return success_response( 'Korisniku uspješno oduzete uredničke ovlasti.' )
    except AuthorizationError:
        return error_response( 'Neuspješno uklanjanje urednika: Nedovoljne ovlasti.', 403 )
    except DoesNotExist:
        return error_response( 'Neuspješno uklanjanje urednika: Ne postoji korisnik s danim ID-om.', 404 )
    except TypeError as e:
        return error_response( 'Neuspješno uklanjanje urednika: ' + str( e ) )
    except:
        return error_response( 'Neuspješno uklanjanje urednika: Nevaljan zahtjev.' )


# Admin requests management

@app.route( '/admin/requests/list', methods = [ 'GET' ] )
@login_required
def list_requests():
    """Returns a list of all pending slot requests

    Returns a list of dicts { editor : { id, first_name, last_name, email },
        request : { id, time, days_bit_mask, start_date, end_date } }.

    No request params.
    """
    try:
        requests = g.user.get_all_requests()
        data = [{
            'id'            : req.id,
            'time'          : req.time.strftime( '%H:%M'),
            'days_bit_mask' : req.days_bit_mask,
            'start_date'    : req.start_date.strftime( '%d.%m.%Y' ),
            'end_date'      : req.end_date.strftime( '%d.%m.%Y' ),
            'editor'        : {
                'id'            : req.editor.id,
                'first_name'    : req.editor.first_name,
                'last_name'     : req.editor.last_name
            },
            'collisions'    : req.detect_collisions()
        } for req in requests ]
        return data_response( data )
    except AuthorizationError:
        return error_response( 'Neuspješno dohvaćanje popisa zahtjeva: Nedovoljne ovlasti.', 403 )
    except:
        return error_response( 'Neuspješno dohvaćanje popisa zahtjeva.' )

def day_names(bit_mask):
    print(bit_mask)
    bit_mask = int(bit_mask)
    days = [ 'Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned' ];
    present = [];
    for i, day in enumerate(days):
        if bit_mask & (2**i):
            present.append(day)

    return present

@app.route( '/admin/requests/<int:request_id>/allow', methods = [ 'POST' ] )
@login_required
def allow_request( request_id ):
    """Allows a given request for slots

    No request params.
    """
    try:
        req = SlotRequest.get( SlotRequest.id == request_id ).select().join( User ).first()
        g.user.allow_request( request_id )
        rs = RadioStation.get()
        send_mail( '{} - Odobren zahtjev za terminima'.format( rs.name ),
            render_template( 'mail/request_allowed.html', time = req.time, days = day_names( req.days_bit_mask ), start_date = req.start_date, end_date = req.end_date ),
            rs.email, req.editor.email )
        return success_response( 'Zahtjev uspješno odobren.' )
    except AuthorizationError:
        return error_response( 'Neuspješno odobravanje zahtjeva: Nedovoljne ovlasti.', 403 )
    except DoesNotExist:
        return error_response( 'Neuspješno odobravanje zahtjeva: Ne postoji zahtjev s danim ID-om.', 404 )
    except peewee.IntegrityError:
        return error_response( 'Neuspješno odobravanje zahtjeva: Preklapanje s već postojećim terminom.', 409 )
    except:
        return error_response( 'Neuspješno odobravanje zahtjeva: Nevaljan zahtjev.' )

@app.route( '/admin/requests/<int:request_id>/deny', methods = [ 'POST' ] )
@login_required
def deny_request( request_id ):
    """Denies a given request for slots

    No request params.
    """
    try:
        req = SlotRequest.get( SlotRequest.id == request_id ).select().join( User ).first()
        print(req)
        g.user.deny_request( request_id )
        rs = RadioStation.get()
        send_mail( '{} - Odbijen zahtjev za terminima'.format( rs.name ),
            render_template( 'mail/request_denied.html', time = req.time, days = day_names( req.days_bit_mask ), start_date = req.start_date, end_date = req.end_date ),
            rs.email, req.editor.email )
        return success_response( 'Zahtjev uspješno odbijen.' )
    except AuthorizationError:
        return error_response( 'Neuspješno odbijanje zahtjeva: Nedovoljne ovlasti.', 403 )
    except DoesNotExist:
        return error_response( 'Neuspješno odbijanje zahtjeva: Ne postoji zahtjev s danim ID-om.', 404 )
    except Exception as e:
        print(e)
        return error_response( 'Neuspješno odbijanje zahtjeva: Nevaljan zahtjev.' )


# Admin user management

@app.route( '/admin/users/list', methods = [ 'GET' ] )
@login_required
def list_users():
    """Returns a list of all the users (excluding admins and owner)

    Returns a list of dicts { id, first_name, last_name, occupation, year_of_birth, email, account_type }
    representing users.
    No request params.
    """
    try:
        users = g.user.get_all_users()
        data = [{
            'id'            : user.id,
            'first_name'    : user.first_name,
            'last_name'     : user.last_name,
            'occupation'    : user.occupation,
            'year_of_birth' : user.year_of_birth,
            'email'         : user.email,
            'account_type'  : user.account_type
        } for user in users ]
        return data_response( data )
    except AuthorizationError:
        return error_response( 'Neuspješno dohvaćanje popisa korisnika: Nedovoljne ovlasti.', 403 )
    except:
        return error_response( 'Neuspješno dohvaćanje popisa korisnika: Nevaljan zahtjev.' )

@app.route( '/admin/users/<int:user_id>/get', methods = [ 'GET' ] )
@login_required
def get_user_data( user_id ):
    """Returns account data of user with a given id

    No request params.
    """
    try:
        user = g.user.get_user( user_id )
        data = {
            'id'            : user.id,
            'first_name'    : user.first_name,
            'last_name'     : user.last_name,
            'email'         : user.email,
            'occupation'    : user.occupation,
            'year_of_birth' : user.year_of_birth,
            'account_type'  : user.account_type
        }
        return data_response( data )
    except AuthorizationError:
        return error_response( 'Neuspješno dohvaćanje korisničkih podataka: Nedovoljne ovlasti.', 403 )
    except DoesNotExist:
        return error_response( 'Neuspješno dohvaćanje korisničkih podataka: Ne postoji korisnik s danim ID-om.', 404 )
    except:
        return error_response( 'Neuspješno dohvaćanje korisničkih podataka: Nevaljan zahtjev.' )

@app.route( '/admin/users/<int:user_id>/modify', methods = [ 'POST' ] )
@login_required
def modify_user_data( user_id ):
    """Modify user data

    Request should contain `first_name`, `last_name`, `email`, `occupation`,
    and `year_of_birth` arguments.
    """
    first_name      = request.values.get( 'first_name' )
    last_name       = request.values.get( 'last_name' )
    email           = request.values.get( 'email' )
    occupation      = request.values.get( 'occupation' )
    year_of_birth   = request.values.get( 'year_of_birth' )

    if year_of_birth is not None: year_of_birth = int( year_of_birth )

    try:
        validate_user_data( first_name, last_name, occupation, year_of_birth, email, no_password = True )
        g.user.modify_user_account( user_id, first_name, last_name, occupation, year_of_birth, email )
        return success_response( 'Korisnički podaci uspješno promjenjeni.' )
    except AuthorizationError:
        return error_response( 'Neuspješna promjena korisničkih podataka: Nedovoljne ovlasti.', 403 )
    except DoesNotExist:
        return error_response( 'Neuspješna promjena korisničkih podataka: Ne postoji korisnik s danim ID-om.', 404 )
    except ValueError as e:
        return error_response( 'Neuspješna promjena korisničkih podataka: Uneseni su neispravni podaci: ' + str( e ) )
    except peewee.IntegrityError:
        return error_response( 'Neuspješna promjena korisničkih podataka: Email adresa se već koristi.', 409 )
    except:
        return error_response( 'Neuspješna promjena korisničkih podataka: Nevaljan zahtjev.' )

@app.route( '/admin/users/<int:user_id>/delete', methods = [ 'POST' ] )
@login_required
def delete_user( user_id ):
    """Deletes user with a given id

    No request params.
    """
    try:
        g.user.delete_user_account( user_id )
        return success_response( 'Korisnik uspješno izbrisan.' )
    except AuthorizationError:
        return error_response( 'Neuspješno brisanje korisnika: Nedovoljne ovlasti.', 403 )
    except DoesNotExist:
        return error_response( 'Neuspješno brisanje korisnika: Ne postoji korisnik s danim ID-om.', 404 )
    except:
        return error_response( 'Neuspješno brisanje korisnika: Nevaljan zahtjev.' )


# Editor slot management

@app.route( '/editor/slots/list', methods = [ 'GET' ], defaults = { 'date' : None } )
@app.route( '/editor/slots/list/<date>', methods = [ 'GET' ] )
@login_required
def list_editor_slots( date ):
    """Return a list of all editor's slots and requests

    Date should be in YYYY-MM-DD format.
    No request params.
    """
    try:
        slots = g.user.get_slots()
        requests = g.user.get_requests()
        if date is not None:
            date = datetime_from_string( date ).date()
            slots = filter( lambda slot : is_same_week( date, slot.time ), slots )
            requests = filter( lambda req : req.start_date <= date and req.end_date >= date, requests )
        data = {
            'slots' : [{
                'id'    : slot.id,
                'time'  : slot.time.isoformat(),
                'count' : slot.count
            } for slot in slots ],

            'requests' : [{
                'id'    : req.id,
                'times' : list( map( datetime.isoformat, generate_times( req.time, req.days_bit_mask, req.start_date, req.end_date ) ) )
            } for req in requests ]
        }
        return data_response( data )
    except AuthorizationError:
        return error_response( 'Neuspješno dohvaćanje popisa termina: Nedovoljne ovlasti.', 403 )
    except Exception as e:
        print(e)
        return error_response( 'Neuspješno dohvaćanje popisa termina: Nevaljan zahtjev.' )

@app.route( '/editor/slots/request', methods = [ 'POST' ] )
@login_required
def request_slot():
    """Make a request for time slots

    Request should contain `time`, `days_bit_mask`, `start_date` and `end_date`.
    `time` should be an integer between 0 and 23 (hour), and dates should be in
    YYYY-MM-DD format.
    """
    request_time    = request.values.get( 'time' )
    days_bit_mask   = request.values.get( 'days_bit_mask' )
    start_date      = request.values.get( 'start_date' )
    end_date        = request.values.get( 'end_date' )

    if request_time is not None: request_time = time( hour = int( request_time ) )
    if days_bit_mask is not None: days_bit_mask = int( days_bit_mask[ ::-1 ], 2 )
    if start_date is not None: start_date = datetime_from_string( start_date ).date()
    if end_date is not None: end_date = datetime_from_string( end_date ).date()

    try:
        g.user.request_slot( request_time, days_bit_mask, start_date, end_date )
        return success_response( 'Zahtjev uspješno pohranjen.', 201 )
    except AuthorizationError:
        return error_response( 'Neuspješno pohranjivanje zahtjeva: Nedovoljne ovlasti.', 403 )
    except Exception as e:
        return error_response( 'Neuspješno pohranjivanje zahtjeva: Nevaljan zahtjev.' )

@app.route( '/editor/slots/<int:slot_id>/get_list', methods = [ 'GET' ] )
@login_required
def get_playlist( slot_id ):
    """Get current slot playlist

    Returns a list of dicts { title, artist, album, genre, index, duration }
    representing tracks on this slot's playlist.
    No request params.
    """
    try:
        slot_items = g.user.get_slot_playlist( slot_id )
        data = [{
            'id'            :   item.track.id,
            'title'         :   item.track.title,
            'artist'        :   item.track.artist,
            'album'         :   item.track.album,
            'index'         :   item.index,
            'duration'      :   item.play_duration
        } for item in slot_items ]
        return data_response( data )
    except AuthorizationError:
        return error_response( 'Neuspješno dohvaćanje liste za reprodukciju: Nedovoljne ovlasti.', 403 )
    except DoesNotExist:
        return error_response( 'Neuspješno dohvaćanje liste za reprodukciju: Ne postoji termin s danim ID-om.', 404 )
    except Exception as e:
        print(e)
        return error_response( 'Neuspješno dohvaćanje liste za reprodukciju: Nevaljan zahtjev.' )

@app.route( '/editor/slots/<int:slot_id>/set_list', methods = [ 'POST' ] )
@login_required
def set_playlist( slot_id ):
    """Set playlist for slot with a given id

    Request should contain a list of ( index, track_id, duration ) representing
    tracks to be placed on the slot's playlist.
    """

    try:
        print(request)
        track_list = request.get_json( force = True )
        print(track_list)
        # TODO: Perform a check for list correctness
        g.user.set_slot_playlist( slot_id, track_list )
        return success_response( 'Lista za reprodukciju uspješno pohranjena', 201 )
    except AuthorizationError:
        return error_response( 'Neuspješno pohranjivanje liste za reprodukciju: Nedovoljne ovlasti.', 403 )
    except DoesNotExist:
        return error_response( 'Neuspješno pohranjivanje liste za reprodukciju: Ne postoji termin s danim ID-om.', 404 )
    except Exception as e:
        print(e)
        return error_response( 'Neuspješno pohranjivanje liste za reprodukciju: Nevaljan zahtjev.' )


# Owner admins management

@app.route( '/owner/admins/list', methods = [ 'GET' ] )
@login_required
def list_admins():
    """Return a list of all admins

    Returns a list of dicts { id, first_name, last_name, email } representing administrators.
    No request params.
    """
    try:
        admins = g.user.get_all_admins()
        data = [{
            'id'            : admin.id,
            'first_name'    : admin.first_name,
            'last_name'     : admin.last_name,
            'email'         : admin.email,
            'occupation'    : admin.occupation,
            'year_of_birth' : admin.year_of_birth
        } for admin in admins ]
        return data_response( data )
    except AuthorizationError:
        return error_response( 'Neuspješno dohvaćanje popisa administratora: Nedovoljne ovlasti.', 403 )
    except:
        return error_response( 'Neuspješno dohvaćanje popisa administratora: Nevaljan zahtjev.' )

@app.route( '/owner/admins/add/<int:user_id>', methods = [ 'POST' ] )
@login_required
def add_admin( user_id ):
    """Grant administrative privileges to user with `user_id`

    No request params.
    """
    print(user_id)
    try:
        g.user.add_admin( user_id )
        return success_response( 'Korisnik uspješno postavljen za administratora.' )
    except AuthorizationError:
        return error_response( 'Neuspješno postavljanje administatora: Nedovoljne ovlasti.', 403 )
    except DoesNotExist:
        return error_response( 'Neuspješno postavljanje administatora: Ne postoji korisnik s danim ID-om.', 404 )
    except ValueError:
        return error_response( 'Neuspješno postavljanje administatora: Prekoračen najveći dopušteni broj od 10 administatora.', 409 )
    except TypeError as e:
        return error_response( 'Neuspješno postavljanje administatora: ' + str( e ) )
    except:
        return error_response( 'Neuspješno postavljanje administatora: Nevaljan zahtjev.' )

@login_required
@app.route( '/owner/admins/remove/<int:admin_id>', methods = [ 'POST' ] )
def remove_admin( admin_id ):
    """Revoke administrative privileges from user with `admin_id`

    No request params.
    """
    try:
        g.user.remove_admin( admin_id )
        return success_response( 'Korisniku uspješno ukinute administratorske ovlasti.' )
    except AuthorizationError:
        return error_response( 'Neuspješno uklanjanje administratora: Nedovoljne ovlasti.', 403 )
    except DoesNotExist:
        return error_response( 'Neuspješno uklanjanje administratora: Ne postoji korisnik s danim ID-om.', 404 )
    except TypeError as e:
        return error_response( 'Neuspješno uklanjanje administratora: ' + str( e ) )
    except:
        return error_response( 'Neuspješno uklanjanje administratora: Nevaljan zahtjev.' )


# Owner radiostation management

@app.route( '/owner/station/modify', methods = [ 'POST' ] )
@login_required
def modify_station_data():
    """Modify radio station data

    Request should contain `name`, `description`, `oib`, `address`, `email` and `frequency`.
    """
    name        = request.values.get( 'name' )
    description = request.values.get( 'description' )
    oib         = request.values.get( 'oib' )
    address     = request.values.get( 'address' )
    email       = request.values.get( 'email' )
    frequency   = request.values.get( 'frequency' )

    if frequency is not None: frequency = float( frequency )

    try:
        validate_radio_station_data( name, description, oib, address, email, frequency )
        g.user.modify_station_data( name, description, oib, address, email, frequency )
        return success_response( 'Podaci o postaji uspješno promjenjeni.' )
    except AuthorizationError:
        return error_response( 'Neuspješna promjena podataka: Nedovoljne ovlasti.', 403 )
    except ValueError as e:
        return error_response( 'Neuspješna promjena podataka: Uneseni su neispravni podaci: ' + str( e ) )
    except:
        return error_response( 'Neuspješna promjena podataka: Nevaljan zahtjev.' )


# Station routes

@app.route( '/station/get', methods = [ 'GET' ] )
def get_station_data():
    """Returns radio station data

    No request params.
    """
    try:
        station = RadioStation.get()
        data = {
            'name'          : station.name,
            'description'   : station.description,
            'oib'           : station.oib,
            'address'       : station.address,
            'email'         : station.email,
            'frequency'     : station.frequency
        }
        return data_response( data )
    except:
        return error_response( 'Neuspješno dohvaćanje podataka o radiopostaji.' )


# Track routes

@app.route( '/tracks/list', methods = [ 'GET' ] )
@login_required
def list_tracks():
    """Returns a list of all tracks

    No request params.
    """
    tracks = g.user.get_all_tracks()
    data = [{
        'id'                : track.id,
        'title'             : track.title,
        'artist'            : track.artist,
        'album'             : track.album,
        'genre'             : track.genre,
        'year'              : track.year
    } for track in tracks ]
    return data_response( data )

@app.route( '/tracks/search/<term>', methods = [ 'GET' ] )
@login_required
def search_tracks( term ):
    """Returns a list of all tracks matching search term.

    No request params.
    """
    try:
        tracks = g.user.search_tracks( term )
        data = [{
            'id'                : track.id,
            'title'             : track.title,
            'artist'            : track.artist,
            'album'             : track.album,
            'genre'             : track.genre,
            'year'              : track.year,
            'duration'          : track.duration
        } for track in tracks ]
        return data_response( data )
    except ValueError:
        return error_response( 'Neuspješno pretraživanje zvučnih zapisa: Prekratak traženi pojam.', 400 )
    except:
        return error_response( 'Neuspješno pretraživanje zvučnih zapisa.' )

@app.route( '/tracks/wishlist', methods = [ 'GET' ] )
@login_required
def get_global_wishlist():
    """Returns the global wishlist

    No request params.
    """
    try:
        wishlist = g.user.get_global_wishlist()
        data = [{
            'id'                : wish.track.id,
            'title'             : wish.track.title,
            'artist'            : wish.track.artist,
            'album'             : wish.track.album,
            'genre'             : wish.track.genre,
            'year'              : wish.track.year,
            'duration'          : wish.track.duration,
            'count'             : wish.count
        } for wish in wishlist ]
        return data_response( data )
    except AuthorizationError:
        return error_response( 'Neuspješno dohvaćanje ukupne liste želja: Nedovoljne ovlasti.', 403 )
    except:
        return error_response( 'Neuspješno dohvaćanje ukupne liste želja.' )

@app.route( '/tracks/popular', methods = [ 'GET' ] )
def get_most_popular_tracks():
    """Returns a list of 5 most popular tracks

    No request params.
    """
    tracks = Track.get_most_popular()
    data = [{
        'title'     : track.title,
        'artist'    : track.artist,
        'popularity': track.popularity
    } for track in tracks ]
    return data_response( data )


# User routes

@app.route( '/users/search/<term>', methods = [ 'GET' ] )
@login_required
def search_users( term ):
    """Returns a list of all users matching search term

    No request params.
    """

    try:
        users = g.user.search_users( term )
        data = [{
            'id'            :   user.id,
            'first_name'    :   user.first_name,
            'last_name'     :   user.last_name,
            'email'         :   user.email,
            'occupation'    :   user.occupation,
            'year_of_birth' :   user.year_of_birth
        } for user in users ]
        return data_response( data )
    except AuthorizationError:
        return error_response( 'Neuspješno pretraživanje korisnika: Nedovoljne ovlasti.', 403 )
    except ValueError:
        return error_response( 'Neuspješno pretraživanje korisnika: Prekratak traženi pojam.', 400 )
    except Exception as e:
        print(e)
        return error_response( 'Neuspješno pretraživanje korisnika.' )


# Slots routes

@app.route( '/slots/schedule', methods = [ 'GET' ], defaults = { 'date' : None } )
@app.route( '/slots/schedule/<date>', methods = [ 'GET' ] )
@login_required
def get_global_schedule( date ):
    """Returns a list of all future slots and their editors

    No request params.
    """
    try:
        slots = g.user.get_all_slots()
        if date is not None:
            date = datetime_from_string( date ).date()
            slots = filter( lambda slot : is_same_week( date, slot.time ), slots )
        data = [{
            'id'    : slot.id,
            'editor': slot.editor.first_name + ' ' + slot.editor.last_name,
            'count' : slot.count,
            'time'  : slot.time.isoformat(),
        } for slot in slots ]
        return data_response( data )
    except AuthorizationError:
        return error_response( 'Nije moguće dohvatiti raspored termina: Nedovoljne ovlasti.', 403 )
    except:
        return error_response( 'Nije moguće dohvatiti raspored termina.' )

@app.route( '/slots/reserved', methods = [ 'GET' ], defaults = { 'date' : None } )
@app.route( '/slots/reserved/<date>', methods = [ 'GET' ] )
@login_required
def get_reserved_slots( date ):
    """Returns a list of all future taken slots

    No request params.
    """
    try:
        slots = g.user.get_reserved_slots()
        if date is not None:
            date = datetime_from_string( date ).date()
            slots = filter( lambda slot : is_same_week( date, slot.time ), slots )
        data = [{
            'time'  :   slot.time.isoformat()
        } for slot in slots ]
        return data_response( data )
    except AuthorizationError:
        return error_response( 'Nije moguće dohvatiti raspored zauzetih termina: Nedovoljne ovlasti.', 403 )
    except:
        return error_response( 'Nije moguće dohvatiti raspored zauzetih termina.' )


# Stat routes

@app.route( '/stats/tracks/<int:track_id>/play_count', methods = [ 'GET' ] )
@login_required
def get_track_play_stat( track_id ):
    """Returns the number of times track was played.

    No request params.
    """
    try:
        count = g.user.get_total_track_play_count_stat( track_id )
        data = { 'count' : count }
        return data_response( data )
    except AuthorizationError:
        return error_response( 'Neuspješno dohvaćanje broja reproduciranja zapisa: Nedovoljne ovlasti.', 403 )
    except DoesNotExist:
        return error_response( 'Neuspješno dohvaćanje broja reproduciranja zapisa: Ne postoji zapis s danim ID-om.', 404 )
    except:
        return error_response( 'Neuspješno dohvaćanje broja reproduciranja zapisa.' )

@app.route( '/stats/tracks/wishlist', methods = [ 'GET' ] )
@login_required
def get_global_wishlist_stat():
    """Returns the global users' wishlist

    No request params.
    """
    try:
        wishlist = g.user.get_global_wishlist()
        data = [{
            'id'                : wish.track.id,
            'title'             : wish.track.title,
            'artist'            : wish.track.artist,
            'album'             : wish.track.album,
            'genre'             : wish.track.genre,
            'count'             : wish.count
        } for wish in wishlist ]
        return data_response( data )
    except AuthorizationError:
        return error_response( 'Neuspješno dohvaćanje ukupne liste želja: Nedovoljne ovlasti.', 403 )
    except:
        return error_response( 'Neuspješno dohvaćanje ukupne liste želja.' )

@app.route( '/stats/tracks/most_wanted', methods = [ 'GET' ] )
@login_required
def get_most_wished_track():
    """Returns track that is most wanted by the users

    No request params.
    """
    try:
        track = g.user.get_most_wished_track()
        data = {
            'title'     : track.title,
            'artist'    : track.artist,
            'album'     : track.album,
            'year'      : track.year,
            'genre'     : track.genre
        }
        return data_response( data )
    except AuthorizationError:
        return error_response( 'Nije moguće dohvatiti podatke o najtraženijem zapisu: Nedovoljne ovlasti.', 403 )
    except:
        return error_response( 'Nije moguće dohvatiti podatke o najtraženijem zapisu.' )

@app.route( '/stats/tracks/most_wanted/wish_count/<start_date>/<end_date>', methods = [ 'GET' ] )
@login_required
def get_most_wished_track_stat( start_date, end_date ):
    """Returns number of times most wanted track was played between `start_date` and `end_date`

    `start_date` and `end_date` should be in YYYY-MM-DD format and passed via URL,
    as declared in `@app.route` above.
    """
    try:
        start_date = datetime_from_string( start_date )
        end_date = datetime_from_string( end_date )
        print ( '{}; {}'.format( start_date, end_date ) )
        count = g.user.get_most_wished_track_stat( start_date, end_date )
        data = { 'count' : count }
        return data_response( data )
    except AuthorizationError:
        return error_response( 'Nije moguće dohvatiti podatke o reprodukciji najtraženijeg zapisa: Nedovoljne ovlasti.', 403 )
    except:
        return error_response( 'Nije moguće dohvatiti podatke o reprodukciji najtraženijeg zapisa.' )

@app.route( '/stats/editors/<int:editor_id>/preferred_tracks', methods = [ 'GET' ] )
@login_required
def get_editor_preferred_tracks( editor_id ):
    """Returns a list of tracks most often played by this editor

    No request params.
    """
    try:
        tracks = g.user.get_editor_preferred_tracks_stat( editor_id )
        data = [{
            'title'     : pt.track.title,
            'artist'    : pt.track.artist,
            'count'     : pt.count
        } for pt in tracks ]
        return data_response( data )
    except AuthorizationError:
        return error_response( 'Neuspjelo dohvaćanje preferenci urednika: Nedovoljne ovlasti.', 403 )
    except DoesNotExist:
        return error_response( 'Neuspjelo dohvaćanje preferenci urednika: Ne postoji korisnik s danim ID-om.', 404 )
    except:
        return error_response( 'Neuspjelo dohvaćanje preferenci urednika: Nevaljan zahtjev.' )

@app.route( '/stats/active_users/count', methods = [ 'GET' ] )
@login_required
def get_active_users_count():
    """Returns number of all users active within the last ten minutes

    No request params.
    """
    try:
        count = g.user.get_active_users_count_stat()
        data = { 'count' : count }
        return data_response( data )
    except AuthorizationError:
        return error_response( 'Neuspjelo dohvaćanje broja aktivnih korisnika: Nedovoljne ovlasti.', 403 )
    except:
        return error_response( 'Neuspjelo dohvaćanje broja aktivnih korisnika: Nevaljan zahtjev.' )

@app.route( '/stats/active_admins/list', methods = [ 'GET' ] )
@login_required
def get_active_admins_list():
    """Returns a list of all admins active within the last ten minutes

    No request params.
    """
    try:
        admins = g.user.get_active_admins_list_stat()
        data = [ admin.first_name + ' ' + admin.last_name for admin in admins ]
        return data_response( data )
    except AuthorizationError:
        return error_response( 'Neuspjelo dohvaćanje popisa aktivnih administratora: Nedovoljne ovlasti.', 403 )
    except:
        return error_response( 'Neuspjelo dohvaćanje popisa aktivnih administratora: Nevaljan zahtjev.' )


@app.route('/<path:path>')
def static_file( path ):
    return app.send_static_file( path )


# Error handlers

@app.errorhandler(404)
def handle_404( error ):
    """Redirect 404 to index.html"""
    return app.send_static_file( 'index.html' )

@app.errorhandler(400)
def handle_400( error ):
    """Handle all uncaught 400 errors"""
    app.logger.error( error.to_dict() )
    return error_response( 'Greška, zahtjev nije moguće ispuniti.', 400 )

@app.errorhandler(500)
def handle_500( error ):
    """Handles all internal server errors"""
    app.logger.error( error.to_dict() )
    return error_response( 'Greška, zahtjev nije moguće ispuniti.', 500 )
