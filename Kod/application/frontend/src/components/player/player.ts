import { Component } from 'angular2/core';
import { COMMON_DIRECTIVES, NgIf } from 'angular2/common';
import { Http } from 'angular2/http';

class Track{
    id: number;
    title: string;
    artist: string;
    album: string;
    genre: string;
    year: number;
    play_duration: number;
    play_location: number;
    editor: string;

    constructor( id : number, title : string, artist : string, album : string, genre : string, year : number, play_duration : number, play_location : number, editor : string ){
        this.id = id;
        this.title = title;
        this.artist = artist;
        this.album = album;
        this.genre = genre;
        this.year = year;
        this.play_duration = play_duration;
        this.play_location = play_location;
        this.editor = editor;
    }
}

@Component({
    selector: 'player',
    templateUrl: './dest/components/player/player.html',
    directives: [ NgIf ]
})
export class Player{
    track: Track;
    http: Http;
    sourceUrl: string = '/player/get';
    audio: any;
    playing: boolean;
    timeout: any;

    constructor( http: Http ){
        this.http = http;
        this.track = new Track( -1, 'Nepostojeći zapis', 'n/a', 'n/a', 'n/a', 0, 0, 0, 'n/a' );
        this.audio = document.getElementById( 'audio-player' );
        //this.audio.src = this.sourceUrl;
        this.playing = false;
        //this.getTrack();
    }

    getTrack( self? : any ){
        if ( !self ) self = this;
        clearTimeout( self.timeout );
        console.log( 'Getting new track' );
        self.audio.pause()
        self.getTrackData();
        self.audio.src = self.sourceUrl;
        //self.audio.load();
        var delta = ( self.track.play_duration - self.track.play_location );
        console.log( delta );
        if ( delta == 0 ) delta = 100;
        self.timeout = setTimeout( () => self.getTrack( self ), delta * 1000 );
        if ( self.playing ) self.audio.play();
    }

    play(){
        console.log( 'playing' );
        this.playing = true;
        this.http.get( '/player/location' ).map( ( res ) => ( res ).json() ).subscribe(
            ( res ) => this.track.play_location = res.data.play_location, ( err ) => console.log( err ) );
        // Test for Apache
        this.audio.onloadedmetadata = () => {
            console.log( 'MD loaded' );
            //this.audio.duration = 105;
            this.audio.currentTime = 100;
            console.log( this.audio.currentTime );
        }
        this.audio.play();
    }

    pause(){
        this.playing = false;
        this.audio.pause();
    }

    volumeUp(){
        this.audio.volume = Math.min( this.audio.volume + 0.1, 1 );
    }

    volumeDown(){
        this.audio.volume = Math.max( this.audio.volume - 0.1, 0 );
    }

    getTrackData(){
        this.http.get( '/player/info' ).map( ( res ) => res.json() ).subscribe( ( res ) => {
            this.track = new Track( res.data.id, res.data.title, res.data.artist, res.data.album, res.data.genre, res.data.year, res.data.play_duration, res.data.play_location, res.data.editor );
            console.log( [ 'Getting track data: ', this.track ] );
        }, ( err ) => console.log( err ));
    }
}
