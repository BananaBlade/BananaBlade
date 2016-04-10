import { Component } from 'angular2/core';
import { COMMON_DIRECTIVES } from 'angular2/common';

import { HttpAdvanced } from '../../services/services';

@Component({
    selector: 'popular',
    directives: [ COMMON_DIRECTIVES ],
    templateUrl: '/dist/components/popular/popular.html'
})
export class Popular{
    http : HttpAdvanced;
    tracks : any[] = [];

    constructor( http : HttpAdvanced ){
        this.http = http;

        this.http.get( '/tracks/popular', ( res ) => {
            var max_popularity : number;
            max_popularity = 0;
            for ( let i in res )
                max_popularity = Math.max( max_popularity, res[ i ].popularity );

            for ( let i in res )
                this.tracks.push( { 'title' : res[ i ].title, 'artist' : res[ i ].artist, 'popularity' : Math.round( res[ i ].popularity / max_popularity * 20 ) } );

        });
    }
}
