
import {View, Component} from 'angular2/core';
import {Location, RouteConfig, RouterLink, Router, CanActivate, RouteParams} from 'angular2/router';
import { Http } from 'angular2/http';
import { urlEncode } from '../../utilities';

@Component({
  selector: 'MakePlaylist',
  templateUrl: './dest/settings/makePlaylist/makePlaylist.html'
})
export class MakePlaylist {
    http: Http;
    slotId: string;
    editable: boolean = true;
    playlist: Track[] = new Array();
    trackSearch: string;

    matching: boolean = false;

    toggleEditable() {
        this.editable = !this.editable;
    }

    removeTrack(track) {
        for (let i in this.playlist) {
            if (this.playlist[i] == track) {
                console.log(track);
                this.playlist.splice(i, 1);
            }
        }
    }

    onKeyPressed(event) {
        let query = this.trackSearch + String.fromCharCode(event.charCode);
        console.log(query);
        this.http.post('/tracks/search', urlEncode({ 'term': query })).map((res) => res.json()).subscribe((res) => {
            this.playlist = new Array();
            for (let i in res.data) {
                this.playlist.push(new Track(res.data[i]));
            }
            console.log(res);
        }, (err) => console.log(err));
    }

    submitPlaylist() {
        this.editable = false;

        let track_list = new Array();
        for (let track in this.playlist) {
            track_list.push({ 'index': track, 'track_id': this.playlist[track].track_id, 'play_duration': this.playlist[track].play_duration})
        }

        this.http.post('/editor/slots/' + this.slotId + '/set_list', urlEncode(track_list)).map((res) => res.json()).subscribe((res) => console.log(res), (err) => console.log(err));
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
    play_duration: number;
    track_id: number;

    constructor(values) {
        console.log(values);
        this.title = values.title;
        this.artist = values.artist;
        this.album = values.album;
        this.index = values.index;
        this.play_duration = values.play_duration;
    }
}