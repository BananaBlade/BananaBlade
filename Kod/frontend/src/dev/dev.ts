
import {View, Component} from 'angular2/core';
import {Location, RouteConfig, RouterLink, Router} from 'angular2/router';

@Component({
    selector: 'dev'
})
@View({
    templateUrl: './dest/dev/dev.html'
})

export class Dev {
    constructor(public router: Router) {
        //
    }
}
/*
class Song {
    name: String;
    artist: String;
    album: Sring;
    duration: Number;
    genre: String;
    currentProgress: Number;
    constructor(name: String, artist: String, album: String, duration: Number, genre: String) {
        this.name = name;
        this.artist = artist;
        this.duration = duration;
        this.genre = genre;
        this.currentProgress = 0;
    }
}*/