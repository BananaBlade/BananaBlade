import {Component} from 'angular2/core'

class Track{
    id: int;
    title: string;
    artist: string;
    album: string;
    genre: string;
    duration: int;
    editor: string;
}

@Component({
    selector: 'player',
    templateUrl: './dest/components/player/player.html',
    directives: []
})
export class Player{
    track: Track;

    constructor(){

    }
}
