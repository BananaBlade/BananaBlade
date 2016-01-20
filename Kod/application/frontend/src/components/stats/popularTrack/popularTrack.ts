import { Component } from 'angular2/core';
import { COMMON_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { Http } from 'angular2/http';

@Component({
    selector : 'popular-track',
    templateUrl : './dest/components/stats/popularTrack/popularTrack.html',
    directives : [ COMMON_DIRECTIVES ]
})
export class PopularTrack{
    http : Http;
    track : Track;
    count : number = -1;
    start_date : string;
    end_date : string;

    constructor( http : Http ){
        this.http = http;
        this.track = new Track( { title : '', artist : '', album : '', genre : '', year : 0 })
        this.http.get( '/stats/tracks/most_wanted' ).subscribe( ( res ) => this.track = new Track( res.json().data ), ( err ) => console.log( err ) );
    }

    onSubmit(){
        this.http.get( '/stats/tracks/most_wanted/wish_count/' + this.start_date + '/'  + this.end_date )
            .subscribe( ( res ) => this.count = res.json().data.count, ( err ) => console.log( err ) );
    }
}

class Track{
    title : string;
    artist : string;
    album : string;
    genre : string;
    year : number;

    constructor( values ){
        this.title = values.title;
        this.artist = values.artist;
        this.album = values.album;
        this.genre = values.genre;
        this.year = values.year;
    }
}
