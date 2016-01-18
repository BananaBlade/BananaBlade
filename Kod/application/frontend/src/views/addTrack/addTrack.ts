
import {View, Component} from 'angular2/core';
import {Location, RouteConfig, RouterLink, Router} from 'angular2/router';

import { FILE_UPLOAD_DIRECTIVES, FileUploader } from '../../services/ng2-file-upload2/ng2-file-upload';

@Component({
    selector: 'AddTrack',
    templateUrl: './dest/views/addTrack/addTrack.html',
    directives: [ FILE_UPLOAD_DIRECTIVES ]
})
export class AddTrack {
    private uploadUrl: string = "/admin/tracks/upload";
    private uploader: FileUploader = new FileUploader({ url: this.uploadUrl });
}
