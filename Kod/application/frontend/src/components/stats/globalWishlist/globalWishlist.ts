import { Component } from 'angular2/core';
import { COMMON_DIRECTIVES } from 'angular2/common';
import { Http } from 'angular2/http';

@Component({
    selector : 'global-wishlist',
    templateUrl : './dest/components/stats/globalWishlist/globalWishlist.html',
    directives : [ COMMON_DIRECTIVES ]
})
export class GlobalWishlist{
    http : Http;
    wishes : Wish[] = [];

    constructor( http : Http ){
        this.http = http;
        this.http.get( '/stats/tracks/wishlist' ).subscribe(
            ( res ) => {
                var data = res.json().data;
                var end = Math.min( 10, data.length );
                for ( var i = 0; i < end; ++i )
                    this.wishes.push( new Wish( data[ i ] ) );
            }, ( err ) => console.log( err ) );
    }
}

class Wish{
    title : string;
    artist : string;
    count : number;

    constructor( values ){
        this.title = values.title;
        this.artist = values.artist;
        this.count = values.count;
    }
}
