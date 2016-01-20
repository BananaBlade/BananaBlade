import {Component} from 'angular2/core';
import { COMMON_DIRECTIVES } from 'angular2/common';
import { Location, RouteConfig, RouterLink, Router, CanActivate } from 'angular2/router';
import { Http } from 'angular2/http';

@Component({
  selector: 'MakeWishlist',
  templateUrl: './dest/views/makeWishlist/makeWishlist.html',
  directives: [ COMMON_DIRECTIVES ]
})
export class MakeWishlist {
    http : Http;
    router : Router;
    tracks : Track[] = [];
    confirmation_time : number;
    trackSearch: string;
    searchResults: Track[] = new Array();
    editable : boolean = false;
    matching: boolean = false;

    constructor( http: Http, router : Router ){
        this.http = http;
        this.router = router;

        this.http.get( '/user/wishlist/get' ).subscribe( ( res ) => {
            for ( let i in res.json().data )
                this.tracks.push( new Track( res.json().data[ i ] ) );
        }, ( err ) => console.log( err ) );


    }

    toggleEditable(){ this.editable = !this.editable; }

    addToWishlist( track : Track ){
        if ( this.tracks.length > 9 ){
            console.log( 'Too many tracks' );
            return;
        }
        this.tracks.push( track );
        this.trackSearch = '';
        this.searchResults = [];
    }

    onKeyPressed(event) {
        let query = this.trackSearch + String.fromCharCode(event.charCode);
        console.log(query);
        this.http.get('/tracks/search/' + query).map((res) => res.json()).subscribe((res) => {
            this.searchResults = new Array();
            for (let i in res.data) {
                this.searchResults.push(new Track(res.data[i]));
            }
            console.log(res);
        }, (err) => console.log(err));
    }

    removeFromWishlist( track : Track ){
        for ( let i in this.tracks )
            if ( this.tracks[ i ] == track )
                this.tracks.splice( i, 1 )
    }

    saveWishlist(){
        var ids : number[] = [];
        for ( let i in this.tracks )
            ids.push( this.tracks[ i ].id );
        let json_ids = JSON.stringify( ids );
        this.http.post( '/user/wishlist/set', json_ids ).subscribe( ( res ) => { console.log( res ); this.editable = false; }, 
        ( err ) => console.log( err ) );
    }

}

class Track {
    title: string;
    artist: string;
    album: string;
    index: number;
    duration: number;
    id: number;

    constructor(values) {
        this.title = values.title;
        this.artist = values.artist;
        this.album = values.album;
        this.index = values.index;
        this.id = values.id;
        this.duration = values.duration;
    }
}
