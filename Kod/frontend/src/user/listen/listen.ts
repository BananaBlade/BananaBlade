///<reference path='../../../typings/tsd.d.ts'/>

import {View, Component} from 'angular2/angular2';
import {Location, RouteConfig, RouterLink, Router} from 'angular2/router';

@Component({
  selector: 'listen'
})
@View({
  templateUrl: './dest/user/listen/listen.html'
})

export class Listen {
  currentSong: Song;

  constructor(public router: Router) {
    this.currentSong = new Song("Symphony No. 9 in D Minor, Op. 125 \"Choral\": IV. Presto - Allegro assai - Choral Finale (Ode to Joy)", "Konan", "Pobjede", 2142, "Rok");
  }
}

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
}