
import { View, Component } from 'angular2/core';
import { Location, RouteConfig, RouterLink, Router, CanActivate } from 'angular2/router';
import { Http } from 'angular2/http';
import { NgIf, NgFor, FORM_DIRECTIVES} from 'angular2/common';

@Component({
    selector: 'ManageTracks',
    templateUrl: './dest/views/manageTracks/manageTracks.html',
    directives: [ NgFor, RouterLink ]
})
export class ManageTracks {
    http: Http;
    router: Router;

    tracks: Track[];
    editable: boolean = false;

    toggleEditable(){
        this.editable = !this.editable;
    }

    editTrack(track) {
        this.router.navigate(['EditTrack', { trackId: track.id }]);
    }

    deleteTrack(track) {
        for (let i in this.tracks) {
            if (this.tracks[i].id == track.id) {
                this.tracks.splice(i, 1);
                break;
            }
        }
        this.http.post('admin/tracks/' + track.id + '/delete', '').subscribe((res) => console.log(res), (err) => console.log(err));
    }

    constructor(router: Router, http: Http) {
        this.http = http;
        this.router = router;

        this.http.get('/tracks/list').map((res) => res.json()).subscribe((res) => {
            console.log(res);
            this.tracks = new Array();
            for (let i in res.data) {
                this.tracks.push(new Track(res.data[i]));
            }
        }, (err) => console.log(err));
    }
}


class Track {
    id: number;
    title: string;
    duration: number;
    artist: string;
    year: number;
    genre: string;

    constructor(values) {
        this.id = values.id;
        this.title = values.title;
        this.duration = values.duration;
        this.artist = values.artist;
        this.year = values.year;
        this.genre = values.genre;
    }
}
