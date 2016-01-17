import { Component } from 'angular2/core';
import { COMMON_DIRECTIVES } from 'angular2/common';
import { Http } from 'angular2/http';

class Track{
    id: number;
    title: string;
    artist: string;
    album: string;
    genre: string;
    year: number;
    duration: number;
    editor: string;

    constructor( id : number, title : string, artist : string, album : string, genre : string, year : number, duration : number, editor : string ){
        this.id = id;
        this.title = title;
        this.artist = artist;
        this.album = album;
        this.genre = genre;
        this.year = year;
        this.duration = duration;
        this.editor = editor;
    }
}

@Component({
    selector: 'player',
    templateUrl: './dest/components/player/player.html',
    directives: []
})
export class Player{
    track: Track;
    http: Http;

    constructor( http: Http ){
        this.http = http;
    }

    getTrack(){
        this.http.get( '/player/info' ).map( ( res ) => res.json() ).subscribe( ( res ) => {
            this.track =
        }, ( err ) => console.log( err ));
    }
}
