import { Component } from 'angular2/core';
import { FORM_DIRECTIVES } from 'angular2/common';

import { FILE_UPLOAD_DIRECTIVES, FileUploader } from '../../services/services';

@Component({
    selector: 'AddTrack',
    templateUrl: './dest/views/addTrack/addTrack.html',
    directives: [ FILE_UPLOAD_DIRECTIVES, FORM_DIRECTIVES ]
})
export class AddTrack {
    private uploadUrl: string = "/admin/tracks/upload";
    private uploader: FileUploader = new FileUploader({ url: this.uploadUrl });
    title : string;
    artist : string;
    album : string;
    genre : string;
    publisher : string;
    carrier_type : string;
    bits_per_sample : number;
    sample_rate : number;
    file_format : number;
    duration : number;
    path : string;

    constructor(){
        this.uploader.onSuccessItem = function success( item:any, response:any, status:any, headers:any ) {
            var res = JSON.parse( response );
            console.log( res );
            this.path = res.data.path;
        }
    }

    onSubmit(){
        this.uploader.uploadAll();
        // Make request to the server
    }
}
