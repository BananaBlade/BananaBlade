import { Component } from 'angular2/core';
import { COMMON_DIRECTIVES, NgIf } from 'angular2/common';

import { HttpAdvanced } from './../../services/services';

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
    http: HttpAdvanced;
    sourceUrl: string = '/player/get';
    audio: any;
    playing: boolean;
    timeout: any;

    constructor( http: HttpAdvanced ){
        this.http = http;

        this.track = new Track( -1, 'Nepostojeći zapis', 'n/a', 'n/a', 'n/a', 0, 0, 0, 'n/a' );
        this.audio = document.getElementById( 'audio-player' );
        this.playing = false;
        if ( this.audio ) {
            console.log( 'init playing' )
            this.audio.src = this.sourceUrl;
            this.playing = false;
            this.getTrack();
        }
    }

    getTrack( self? : any ){
        if ( !self ) self = this;
        clearTimeout( self.timeout );
        console.log( 'Getting new track' );
        self.pause()
        self.getTrackData();
        self.audio.src = self.sourceUrl;
        var delta = ( self.track.play_duration - self.track.play_location );
        console.log( delta );
        if ( delta == 0 ) delta = 100;
        self.timeout = setTimeout( () => self.getTrack( self ), delta * 1000 );
        if ( self.playing ) self.play();
    }

    play(){
        console.log( 'playing' );
        this.playing = true;
        this.http.getNoError( '/player/location', (res) => {
            this.track.play_location = res.play_location;
            console.log( res.play_location )
        });
        // Test for Apache
        this.audio.onloadedmetadata = () => {
            console.log( 'MD loaded' );
            this.audio.currentTime = this.track.play_location;
            console.log( this.audio.currentTime );
            this.audio.play();
            this.playing = true;
        }
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
        this.http.getNoError('/player/info', ( res ) => {
            this.track = new Track( res.id, res.title, res.artist, res.album, res.genre, res.year, res.play_duration, res.play_location, res.editor );
            console.log( [ 'Getting track data: ', this.track ] );
        });
    }
}
