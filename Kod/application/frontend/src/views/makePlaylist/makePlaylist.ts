
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
    editable: boolean = false;
    playlist: Track[] = new Array();
    wishes: Track[] = [];
    trackSearch: string;
    searchResults: Track[] = new Array();

    barPercentage: number = 0;
    minutesSpent: string = '00';
    secondsSpent: string = '00';

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
        var tminutesSpent = '' + ( ~~ (durationSum / 60) );
        var tsecondsSpent = durationSum % 60;
        this.minutesSpent = ( tminutesSpent < 10 ? '0' : '' ) + tminutesSpent;
        this.secondsSpent = ( tsecondsSpent < 10 ? '0' : '' ) + tsecondsSpent;
    }

    addTrackToPlaylist(track) {
        var totalTime = this.getTotalTime()
        if ( totalTime > 60*60 ){
            console.log( 'Over the limit already, wont add.' );
            return;
        }
        var delta = 60*60 - totalTime - track.duration;
        if ( delta > 0 && delta < 15 ){
            console.log( 'Next track will be played too shortly - cannot add this.' );
            return;
        }

        if ( delta < 0 )
            track.duration = 60*60 - totalTime;
        track.calculateMS();

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

        if ( this.getTotalTime() < 60*60 ){
            console.log( 'Playlist too short.' );
            return;
        }

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
            this.updateBar();
        }, (err) => console.log(err));

        this.http.get( '/tracks/wishlist' ).subscribe( ( res ) => {
            var array = res.json().data;
            var end = Math.min( array.length, 10 );
            for ( var i = 0; i < end; ++i )
                this.wishes.push( new Track( array[ i ] ) );
        }, ( err ) => console.log( err ) );
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
