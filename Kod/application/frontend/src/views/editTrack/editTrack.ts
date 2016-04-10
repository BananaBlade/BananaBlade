
import { Component } from 'angular2/core';
import { Location, RouteConfig, RouterLink, Router, RouteParams } from 'angular2/router';
import { CORE_DIRECTIVES, FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators, Control } from 'angular2/common';

import { HttpAdvanced } from '../../services/services';

@Component({
    selector: 'AddTrack',
    templateUrl: './dist/views/editTrack/editTrack.html',
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES]
})
export class EditTrack {
    http: HttpAdvanced;

    track: Track;
    trackId: string;

    trackForm: ControlGroup;
    id: Control = new Control('', Validators.required);
    title: Control = new Control('', Validators.required);
    duration: Control = new Control('', Validators.required);
    artist: Control = new Control('', Validators.required);
    year: Control = new Control('', Validators.required);
    genre: Control = new Control('', Validators.required);
    album: Control = new Control('', Validators.required);
    file_format: Control = new Control('', Validators.required);
    sample_rate: Control = new Control('', Validators.required);
    bits_per_sample: Control = new Control('', Validators.required);
    publisher: Control = new Control('', Validators.required);
    carrier_type: Control = new Control('', Validators.required);
    path: Control = new Control('', Validators.required);

    editable : boolean = false;

    constructor(http: HttpAdvanced, routeParams: RouteParams, fb: FormBuilder) {
        this.http = http;

        this.trackId = routeParams.get('trackId');

        this.trackForm = fb.group({
            id: this.id,
            title: this.title,
            duration: this.duration,
            artist: this.artist,
            year: this.year,
            genre: this.genre,
            album: this.album,
            file_format: this.file_format,
            sample_rate: this.sample_rate,
            bits_per_sample: this.bits_per_sample,
            publisher: this.publisher,
            carrier_type: this.carrier_type,
            path: this.path
        });

        this.resetForm();
    }

    resetForm() {
        this.http.get('/admin/tracks/' + this.trackId + '/get', (res) => {
            console.log(res);
            this.track = new Track(res);
            for (let name in res) {
                this[name].updateValue(res[name]);
            }
        });
    }

    onSubmit(values) {
        this.http.postWithRes('/admin/tracks/' + this.trackId + '/edit', values, (res) => { 
            console.log(res); 
            this.editable = false; 
        });
    }

    toggleEditable(){
        this.resetForm();
        this.editable = !this.editable; 
    }
}


class Track {
    id: number;
    title: string;
    duration: number;
    artist: string;
    year: number;
    genre: string;
    album: string;
    file_format: string;
    sample_rate: number;
    bits_per_sample: number;
    publisher: string;
    carrier_type: string;
    path: string;

    constructor(values) {
        this.id = values.id;
        this.title = values.title;
        this.duration = values.duration;
        this.artist = values.artist;
        this.year = values.year;
        this.genre = values.genre;
        this.album = values.album;
        this.file_format = values.file_format;
        this.sample_rate = values.sample_rate;
        this.bits_per_sample = values.bits_per_sample;
        this.publisher = values.publisher;
        this.carrier_type = values.carrier_type;
        this.path = values.path;
    }
}
