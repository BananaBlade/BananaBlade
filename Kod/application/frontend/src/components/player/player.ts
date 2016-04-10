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
    templateUrl: './dist/components/player/player.html',
    directives: [ NgIf ]
})
export class Player{
    track: Track;
    http: HttpAdvanced;
    sourceUrl: string = '/player/get';
    audio: any = { currentTime : 0, duration : 100 };
    playing: boolean;
    timeout: any;
    progress: number = 0;

    constructor( http: HttpAdvanced ){
        this.http = http;
        this.track = new Track( -1, 'Nepostojeći zapis', 'n/a', 'n/a', 'n/a', 0, 0, 0, 'n/a' );

        setTimeout( () => {
            this.audio = document.getElementById( 'audio-player' );
            this.playing = false;
            if ( this.audio ) {
                this.audio.src = this.sourceUrl;
                this.audio.volume = 0.6;
                this.playing = false;
                this.loadTrackData();
                this.calcProgress();
            }
        }, 1000 );
    }

    calcProgress(){
        this.progress = this.audio.currentTime / this.audio.duration;
        setTimeout( () => this.calcProgress(), 1000 );
    }

    calcDelta(){
        var delta = ( this.track.play_duration - this.track.play_location );
        if ( delta == 0 ) delta = 100;
        return delta * 1000;
    }

    play(){
        this.audio.load();
        this.audio.onloadedmetadata = () => {
            this.http.getNoError( '/player/location', (res) => {
                this.track.play_location = res.play_location;
                this.audio.currentTime = this.track.play_location;
                this.audio.play();
                this.playing = true;
            });
        }
    }

    // loadTrack( self? : any ){
    //     if ( !self ) self = this;
    //     clearTimeout( self.timeout );
    //     self.pause()
    //     self.getTrackData();
    //     self.audio.src = self.sourceUrl;
    //     var delta = ( self.track.play_duration - self.track.play_location );
    //     console.log( delta );
    //     if ( delta == 0 ) delta = 100;
    //     self.timeout = setTimeout( () => self.getTrack( self ), delta * 1000 );
    //     if ( self.playing ) self.play();
    // }
    //
    // play(){
    //     console.log( 'start playing' );
    //     this.audio.load();
    //     // Test for Apache
    //     this.audio.onloadedmetadata = () => {
    //         console.log( 'MD loaded' );
    //         this.http.getNoError( '/player/location', (res) => {
    //             this.track.play_location = res.play_location;
    //             console.log( res.play_location )
    //             this.audio.currentTime = this.track.play_location;
    //             console.log( this.audio.currentTime );
    //             this.audio.play();
    //             this.playing = true;
    //         });
    //     }
    // }

    pause(){
        this.playing = false;
        this.audio.pause();
        clearTimeout( this.timeout );
    }

    volumeUp(){
        this.audio.volume = Math.min( this.audio.volume + 0.1, 1 );
    }

    volumeDown(){
        this.audio.volume = Math.max( this.audio.volume - 0.1, 0 );
    }

    loadTrackData(){
        this.http.getNoError('/player/info', ( res ) => {
            this.track = new Track( res.id, res.title, res.artist, res.album, res.genre, res.year, res.play_duration, res.play_location, res.editor );

            this.http.getNoError( '/player/location', ( res ) => {
                this.track.play_location = res.play_location;
                console.log( 'Reload' );
                console.log( this.playing );
                if ( this.playing ){
                    this.play();
                }
            });

            setTimeout( () => this.loadTrackData(), this.calcDelta() );
        });
    }
}
