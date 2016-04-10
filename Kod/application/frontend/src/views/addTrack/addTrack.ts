import { Component } from 'angular2/core';
import { FORM_DIRECTIVES } from 'angular2/common';

import { FILE_UPLOAD_DIRECTIVES, FileUploader, Form, FormBuilderAdvanced, HttpAdvanced } from '../../services/services';

let SELF = null;

@Component({
    selector: 'AddTrack',
    templateUrl: './dist/views/addTrack/addTrack.html',
    directives: [ FILE_UPLOAD_DIRECTIVES, FORM_DIRECTIVES ]
})
export class AddTrack {
    private uploadUrl: string = "/admin/tracks/upload";
    private uploader: FileUploader = new FileUploader({ url: this.uploadUrl });

    http: HttpAdvanced;
    trackForm: Form;

    constructor(http: HttpAdvanced,fb: FormBuilderAdvanced){
        this.http = http;
        SELF = this;

        let controlNames = ['title', 'artist', 'album', 'genre', 'publisher',
            'carrier_type', 'bits_per_sample', 'sample_rate', 'file_format',
            'duration', 'year'];

        this.trackForm = fb.create(controlNames, '');

        this.uploader.onSuccessItem = function success( item:any, response:any, status:any, headers:any ) {
            var res = JSON.parse( response );
            let data = SELF.trackForm.group.value;
            data.path = res.data.path;
            console.log( res );

            SELF.http.post('/admin/tracks/add', data);
            console.log(SELF.trackForm.group.value);
        }
    }

    onSubmit(){
        this.uploader.uploadAll();
        // Make request to the server
    }
}
