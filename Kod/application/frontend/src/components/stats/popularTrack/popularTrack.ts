import { Component } from 'angular2/core';
import { COMMON_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';

import { HttpAdvanced, AuthService } from '../../../services/services';

@Component({
    selector : 'popular-track',
    templateUrl : './dist/components/stats/popularTrack/popularTrack.html',
    directives : [ COMMON_DIRECTIVES ]
})
export class PopularTrack{
    http: HttpAdvanced;
    track : Track;
    count : number = -1;
    start_date : string;
    end_date : string;

    constructor(http: HttpAdvanced, authService: AuthService) {
        this.http = http;
        this.track = new Track( { title : '', artist : '', album : '', genre : '', year : 0 })

        if (authService.isAdmin())
            this.http.getNoError('/stats/tracks/most_wanted', (res) => this.track = new Track(res));
    }

    onSubmit(){
        this.http.getNoError('/stats/tracks/most_wanted/wish_count/' + this.start_date + '/' + this.end_date, (res) => this.count = res.count);
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
