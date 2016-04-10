import { Component } from 'angular2/core';
import { COMMON_DIRECTIVES } from 'angular2/common';

import { HttpAdvanced } from '../../../services/services';

@Component({
    selector : 'global-wishlist',
    templateUrl : './dist/components/stats/globalWishlist/globalWishlist.html',
    directives : [ COMMON_DIRECTIVES ]
})
export class GlobalWishlist{
    http: HttpAdvanced;
    wishes : Wish[] = [];

    constructor(http: HttpAdvanced) {
        this.http = http;
        this.http.getNoError('/stats/tracks/wishlist', (data) => {
            var end = Math.min(10, data.length);
            for (var i = 0; i < end; ++i)
                this.wishes.push(new Wish(data[i]));
        });
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
