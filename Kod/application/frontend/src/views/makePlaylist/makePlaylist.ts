
import { Component } from 'angular2/core';
import { COMMON_DIRECTIVES } from 'angular2/common';
import {Location, RouteConfig, RouterLink, Router, CanActivate, RouteParams} from 'angular2/router';
import { Http } from 'angular2/http';
import { urlEncode } from '../../services/utilities';

@Component({
  selector: 'MakePlaylist',
  templateUrl: './dest/views/makePlaylist/makePlaylist.html',
  directives: [ COMMON_DIRECTIVES ]
})
export class MakePlaylist {
    http: Http;
    slotId: string;
    editable: boolean = true;
    playlist: Track[] = new Array();
    trackSearch: string;
    searchResults: Track[] = new Array();

    barPercentage: number = 0;
    minutesSpent: number = 0;
    secondsSpent: number = 0;

    matching: boolean = false;

    toggleEditable() {
        this.editable = !this.editable;
    }

    resetPlaylist() {
        this.toggleEditable();
        this.updateBar();
    }

    removeTrack(track) {
        for (let i in this.playlist) {
            if (this.playlist[i] == track) {
                this.playlist.splice(i, 1);
            }
        }
    }

    updateBar() {
        console.log(this.playlist);
        let durationSum = 0;
        for (let i in this.playlist) {
            durationSum += this.playlist[i].duration;
        }
        this.barPercentage = durationSum / 60 / 60 * 100;
        this.minutesSpent = ~~ (durationSum / 60);
        this.secondsSpent = durationSum % 60;
    }

    addTrackToPlaylist(track) {
        this.playlist.push(track);
        this.trackSearch = "";
        this.searchResults = new Array();

        this.updateBar();
    }

    onKeyPressed(event) {
        let query = this.trackSearch + String.fromCharCode(event.charCode);
        console.log(query);
        this.http.get('/tracks/search/' + query).map((res) => res.json()).subscribe((res) => {
            this.searchResults = new Array();
            for (let i in res.data) {
                this.searchResults.push(new Track(res.data[i]));
            }
            console.log(res);
        }, (err) => console.log(err));
    }

    submitPlaylist() {
        this.editable = false;

        let track_list = new Array();
        for (let track in this.playlist) {
            track_list.push([track, this.playlist[track].id, this.playlist[track].duration]);
        }
        let track_list2 = JSON.stringify(track_list);

        this.http.post('/editor/slots/' + this.slotId + '/set_list', track_list2).map((res) => res.json()).subscribe((res) => console.log(res), (err) => console.log(err));
    }

    constructor(http: Http, routeParams: RouteParams) {
        this.http = http;

        this.slotId = routeParams.get('slotId');

        this.http.get('/editor/slots/' + this.slotId + '/get_list').map((res) => res.json()).subscribe((res) => {
            console.log(res);
            this.playlist = new Array();
            for (let i in res.data) {
                this.playlist.push(new Track(res.data[i]));
            }
        }, (err) => console.log(err));
    }
}


class Track {
    title: string;
    artist: string;
    album: string;
    index: number;
    duration: number;
    id: number;

    constructor(values) {
        console.log(values);
        this.title = values.title;
        this.artist = values.artist;
        this.album = values.album;
        this.index = values.index;
        this.id = values.id;
        this.duration = values.duration;
    }
}
