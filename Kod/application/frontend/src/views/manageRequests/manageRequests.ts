
import { Component } from 'angular2/core';
import { Location, RouteConfig, RouterLink, Router, CanActivate } from 'angular2/router';
import { NgIf, NgFor, FORM_DIRECTIVES} from 'angular2/common';

import { HttpAdvanced } from '../../services/services';

@Component({
    selector: 'ManageRequests',
    templateUrl: './dist/views/manageRequests/manageRequests.html',
    directives: [ NgFor, NgIf ]
})
export class ManageRequests {
    http: HttpAdvanced;
    requests: Request[] = new Array();

    constructor(http: HttpAdvanced) {
        this.http = http;

        this.resetList();
    }

    resetList() {
        this.http.get('/admin/requests/list', (res) => {
            this.requests = new Array();
            for (let i in res) {
                this.requests.push(new Request(res[i]));
            }
        });
    }

    approveSlot(slotId) {
        this.http.postWithBothMsg('/admin/requests/' + slotId + '/allow', '', (res) => {
            this.resetList();
        });
    }

    rejectSlot(slotId) {
        this.http.postWithBothMsg('/admin/requests/' + slotId + '/deny', '', (res) => {
            this.resetList();
        });
    }

   deconstructBitmask( bm ){
       var days : string[] = [ 'Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned' ];
       var present : string[] = [];
       for ( var i = 0; i < 7; ++i )
            if ( bm & ( 1 << i ) )
                present.push( days[ i ] );
       return present.join( ', ' );
   }
}

class Request {
    id: number;
    time: string;
    days_bit_mask: number;
    start_date: string;
    end_date: string;
    editor: Editor;
    collisions: boolean;

    constructor(values) {
        this.id = values.id;
        this.time = values.time;
        this.days_bit_mask = values.days_bit_mask;
        this.start_date = values.start_date;
        this.end_date = values.end_date;
        this.editor = new Editor(values.editor);
        this.collisions = values.collisions;
    }
}

class Editor {
    id: number;
    first_name: string;
    last_name: string;

    constructor(values) {
        this.id = values.id;
        this.first_name = values.first_name;
        this.last_name = values.last_name;
    }
}
