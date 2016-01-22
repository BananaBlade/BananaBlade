import { Component } from 'angular2/core';
import { COMMON_DIRECTIVES } from 'angular2/common';

import { HttpAdvanced } from '../../services/services';

@Component({
    selector: 'popular',
    directives: [ COMMON_DIRECTIVES ],
    templateUrl: '/dest/components/popular/popular.html'
})
export class Popular{
    http : HttpAdvanced;
    tracks : any[] = [];

    constructor( http : HttpAdvanced ){
        this.http = http;

        this.http.get( '/tracks/popular', ( res ) => {
            var max_popularity : number;
            max_popularity = 0;
            for ( let i in res.data )
                max_popularity = Math.max( max_popularity, res.data[ i ].popularity );

            for ( let i in res.data )
                this.tracks.push( { 'title' : res.data[ i ].title, 'artist' : res.data[ i ].artist, 'popularity' : Math.round( res.data[ i ].popularity / max_popularity * 20 ) } );

        });
    }
}
