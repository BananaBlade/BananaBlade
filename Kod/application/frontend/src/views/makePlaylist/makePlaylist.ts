
import { Component } from 'angular2/core';
import { COMMON_DIRECTIVES } from 'angular2/common';
import {Location, RouteConfig, RouterLink, Router, CanActivate, RouteParams} from 'angular2/router';

import { HttpAdvanced, MsgService } from '../../services/services';

@Component({
  selector: 'MakePlaylist',
  templateUrl: './dist/views/makePlaylist/makePlaylist.html',
  directives: [ COMMON_DIRECTIVES ]
})
export class MakePlaylist {
    http: HttpAdvanced;
    msgService : MsgService;
    slotId: string;
    editable: boolean = false;
    playlist: Track[] = new Array();
    wishes: Track[] = [];
    trackSearch: string;
    searchResults: Track[] = new Array();

    barPercentage: number = 0;
    minutesSpent: string = '00';
    secondsSpent: string = '00';

    matching: boolean = false;

    constructor(http: HttpAdvanced, routeParams: RouteParams, msgService : MsgService) {
        this.http = http;
        this.msgService = msgService;

        this.slotId = routeParams.get('slotId');

        this.http.get('/editor/slots/' + this.slotId + '/get_list', (res) => {
            this.playlist = new Array();
            for (let i in res) {
                this.playlist.push(new Track(res[i]));
            }
            this.updateBar();
        });

        this.http.get('/tracks/wishlist', (res) => {
            var end = Math.min(res.length, 10);
            for (var i = 0; i < end; ++i)
                this.wishes.push(new Track(res[i]));
        });
    }

    toggleEditable() {
        this.editable = !this.editable;
    }

    resetPlaylist() {
        this.toggleEditable();
        this.updateBar();
    }

    enterCheck(event) {
        let keyCode = event.keyCode;
        if (keyCode == 13 && this.searchResults.length > 0) {
            this.addTrackToPlaylist(this.searchResults[0]);
            this.searchResults = new Array();
            this.trackSearch = "";
        }
        else if (keyCode >= 65 && keyCode <= 90 || keyCode >= 97 && keyCode <= 122 || keyCode == 8) this.onKeyPressed(keyCode)
    }

    removeTrack(track) {
        for (let i in this.playlist) {
            let ii = parseInt(i);
            if (this.playlist[ii] == track) {
                this.playlist.splice(ii, 1);
            }
        }
        this.updateBar();
    }

    getTotalTime(){
        var totalTime = 0;
        for (let i in this.playlist)
            totalTime += this.playlist[i].duration;
        return totalTime;
    }

    updateBar() {
        console.log(this.playlist);
        let durationSum = this.getTotalTime();
        this.barPercentage = durationSum / 60 / 60 * 100;
        var tminutesSpent = ~~ (durationSum / 60);
        var tsecondsSpent = durationSum % 60;
        this.minutesSpent = ( tminutesSpent < 10 ? '0' : '' ) + tminutesSpent;
        this.secondsSpent = ( tsecondsSpent < 10 ? '0' : '' ) + tsecondsSpent;
    }

    addTrackToPlaylist(track) {
        var totalTime = this.getTotalTime()
        if ( totalTime > 60*60 ){
            this.msgService.setMessage( 'Nije moguće dodati novi zapis - već je prekoračeno dozvoljeno vrijeme trajanja liste za reprodukciju.', 'error' );
            this.trackSearch = '';
            this.searchResults = [];
            return;
        }
        var delta = 60*60 - totalTime - track.duration;
        if ( delta > 0 && delta < 15 ){
            this.msgService.setMessage( 'Dodani zapis reproducirao bi se kraće od 15 sekundi, stoga ga nije moguće dodati.', 'error' );
            this.trackSearch = '';
            this.searchResults = [];
            return;
        }

        if ( delta < 0 ) track.duration = 60*60 - totalTime;
        track.calculateMS();

        this.playlist.push(track);
        this.trackSearch = "";
        this.searchResults = new Array();

        this.updateBar();
    }

    onKeyPressed(charCode) {
        let query = "";
        if (charCode == 8) query = this.trackSearch.slice(0, this.trackSearch.length - 1);
        else query = this.trackSearch ? (this.trackSearch + String.fromCharCode(charCode)) : String.fromCharCode(charCode);

        if (query && query.length >= 3) {
            this.http.getNoError('/tracks/search/' + query, (res) => {
                this.searchResults = new Array();
                for (let i in res) {
                    this.searchResults.push(new Track(res[i]));
                }
            });
        }
        else {
            this.searchResults = new Array();
        }
    }

    submitPlaylist() {
        this.editable = false;

        if ( this.getTotalTime() < 60*60 ){
            this.msgService.setMessage( 'Lista za reprodukciju nije dovoljno duga - treba trajati točno 1 sat.', 'error' );
            return;
        }

        let track_list = new Array();
        for (let track in this.playlist) {
            track_list.push([track, this.playlist[track].id, this.playlist[track].duration]);
        }
        let track_list2 = JSON.stringify(track_list);

        this.http.postPure('/editor/slots/' + this.slotId + '/set_list', track_list2);
    }

}

class Track {
    title: string;
    artist: string;
    album: string;
    index: number;
    duration: number;
    id: number;
    minutes : string;
    seconds : string;

    constructor(values) {
        this.title = values.title;
        this.artist = values.artist;
        this.album = values.album;
        this.index = values.index;
        this.id = values.id;
        this.duration = values.duration;
        this.calculateMS();
    }

    calculateMS(){
        var tminutes = ~~(this.duration/60);
        var tseconds = this.duration % 60;

        this.minutes = ( tminutes < 10 ? '0' : '' ) + tminutes;
        this.seconds = ( tseconds < 10 ? '0' : '' ) + tseconds;
    }

    copy(){
        return new Track( this );
    }
}
