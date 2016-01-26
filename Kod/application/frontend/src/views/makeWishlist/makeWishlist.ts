import {Component} from 'angular2/core';
import { COMMON_DIRECTIVES } from 'angular2/common';
import { Location, RouteConfig, RouterLink, Router, CanActivate } from 'angular2/router';

import { HttpAdvanced } from '../../services/services';

@Component({
  selector: 'MakeWishlist',
  templateUrl: './dest/views/makeWishlist/makeWishlist.html',
  directives: [ COMMON_DIRECTIVES ]
})
export class MakeWishlist {
    http: HttpAdvanced;
    router : Router;
    tracks : Track[] = [];
    confirmation_time : number;
    trackSearch: string;
    searchResults: Track[] = new Array();
    editable : boolean = false;
    matching: boolean = false;

    constructor(http: HttpAdvanced, router: Router) {
        this.http = http;
        this.router = router;

        this.http.get('/user/wishlist/get', (res) => {
            for (let i in res)
                this.tracks.push(new Track(res));
        });


    }

    toggleEditable(){ this.editable = !this.editable; }

    addToWishlist( track : Track ){
        if ( this.tracks.length > 9 ){
            console.log( 'Too many tracks' );
            return;
        }
        for ( let i in this.tracks )
            if ( this.tracks[ i ].id == track.id ){
                console.log( 'Duplicate.' )
                return;
            }

        this.tracks.push( track );
        this.trackSearch = '';
        this.searchResults = [];
    }

    onKeyPressed(event) {
        let query = this.trackSearch + String.fromCharCode(event.charCode);
        console.log(query);
        this.http.get('/tracks/search/' + query, (res) => {
            this.searchResults = new Array();
            for (let i in res.data) {
                this.searchResults.push(new Track(res.data[i]));
            }
        });
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
        this.http.postWithRes('/user/wishlist/set', json_ids, (res) => {
            this.editable = false;
        });
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
