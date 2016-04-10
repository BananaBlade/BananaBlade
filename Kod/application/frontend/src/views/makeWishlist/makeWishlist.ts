import {Component} from 'angular2/core';
import { COMMON_DIRECTIVES } from 'angular2/common';
import { Location, RouteConfig, RouterLink, Router, CanActivate } from 'angular2/router';

import { HttpAdvanced, MsgService } from '../../services/services';

@Component({
  selector: 'MakeWishlist',
  templateUrl: './dist/views/makeWishlist/makeWishlist.html',
  directives: [ COMMON_DIRECTIVES ]
})
export class MakeWishlist {
    http: HttpAdvanced;
    router : Router;
    msgService: MsgService;

    tracks : Track[] = [];
    confirmation_time : number;
    trackSearch: string;
    searchResults: Track[] = new Array();
    editable : boolean = false;
    matching: boolean = false;
    can_confirm : boolean = false;

    constructor(http: HttpAdvanced, router: Router, msgService : MsgService) {
        this.http = http;
        this.router = router;
        this.msgService = msgService;
        this.loadData();
    }

    loadData(){
        this.http.get('/user/wishlist/get', (res) => {
            this.tracks = [];
            for (let i in res)
                this.tracks.push(new Track(res[ i ]));
        });

        this.http.get( '/user/wishlist/can_confirm', (res) => {
            this.can_confirm = res.can_confirm;
        });
    }

    toggleEditable(){ this.editable = !this.editable; }

    addToWishlist( track : Track ){
        if ( this.tracks.length > 9 ){
            this.msgService.setMessage( 'Na listi želja je već deset zapisa, nije moguće dodati još jedan.', 'error' );
            return;
        }
        for ( let i in this.tracks )
            if ( this.tracks[ i ].id == track.id ){
                this.msgService.setMessage( 'Taj je zapis već na listi želja.', 'error' );
                return;
            }

        this.tracks.push( track );
        this.trackSearch = '';
        this.searchResults = [];
    }

    onKeyPressed(charCode) {
        let query = "";
        if (charCode == 8) query = this.trackSearch.slice(0, this.trackSearch.length - 1);
        else query = this.trackSearch ? (this.trackSearch + String.fromCharCode(charCode)) : String.fromCharCode(charCode);

        if (query && query.length >= 3) {
            this.http.getNoError('/tracks/search/' + query, (res) => {
                this.searchResults = new Array();
                for (let i in res) {
                    this.searchResults.push(new Track(res[i]));
                }
            });
        }
        else {
            this.searchResults = new Array();
        }
    }
    enterCheck(event) {
        let keyCode = event.keyCode;
        if (keyCode == 13 && this.searchResults.length > 0) {
            this.addToWishlist(this.searchResults[0]);
            this.searchResults = new Array();
            this.trackSearch = "";
        }
        else if (keyCode >= 65 && keyCode <= 90 || keyCode >= 97 && keyCode <= 122 || keyCode == 8) this.onKeyPressed(keyCode)
    }

    removeFromWishlist( track : Track ){
        for ( let i in this.tracks ) {
            let ii = parseInt(i);
            if ( this.tracks[ ii ] == track )
                this.tracks.splice( ii, 1 )
        }
    }

    saveWishlist(){
        var ids : number[] = [];
        for ( let i in this.tracks )
            ids.push( this.tracks[ i ].id );
        let json_ids = JSON.stringify( ids );
        console.log( json_ids );
        this.http.postPure( '/user/wishlist/set', json_ids, (res) => {
            this.editable = false;
        });
    }

    confirmWishlist(){
        this.http.postWithRes( '/user/wishlist/confirm', '', ( res ) => {
            this.msgService.setMessage('Lista želja uspješno potvrđena', 'success');
            this.loadData();
        })
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
