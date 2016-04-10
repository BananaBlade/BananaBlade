
import { Component } from 'angular2/core';
import { Location, RouteConfig, RouterLink, Router, CanActivate } from 'angular2/router';
import { NgIf, NgFor, FORM_DIRECTIVES} from 'angular2/common';

import { HttpAdvanced } from '../../services/services';

@Component({
    selector: 'ManageTracks',
    templateUrl: './dist/views/manageTracks/manageTracks.html',
    directives: [ NgFor, RouterLink ]
})
export class ManageTracks {
    http: HttpAdvanced;
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
            let ii = parseInt(i);
            if (this.tracks[ii].id == track.id) {
                this.tracks.splice(ii, 1);
                break;
            }
        }
        this.http.postWithBothMsg('admin/tracks/' + track.id + '/delete', '');
    }

    constructor(router: Router, http: HttpAdvanced) {
        this.http = http;
        this.router = router;

        this.http.get('/tracks/list', (res) => {
            console.log(res);
            this.tracks = new Array();
            for (let i in res) {
                this.tracks.push(new Track(res[i]));
            }
        });
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
