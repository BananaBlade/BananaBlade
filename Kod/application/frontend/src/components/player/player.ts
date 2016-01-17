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
        this.track = new Track( -1, 'Nepostojeći zapis', 'n/a', 'n/a', 'n/a', 0, 0, 'n/a' );
        this.getTrack();
    }

    getTrack(){
        this.http.get( '/player/info' ).map( ( res ) => res.json() ).subscribe( ( res ) => {
            console.log( res.data )
            this.track = new Track( res.data.id, res.data.title, res.data.artist, res.data.album, res.data.genre, res.data.year, res.data.duration, res.data.editor );
        }, ( err ) => console.log( err ));
    }
}
