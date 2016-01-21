
import { View, Component } from 'angular2/core';
import { Location, RouteConfig, RouterLink, Router, CanActivate } from 'angular2/router';
import { NgIf, NgFor, FORM_DIRECTIVES} from 'angular2/common';

import { HttpAdvanced } from '../../services/services';

@Component({
    selector: 'ManageRequests',
    templateUrl: './dest/views/manageRequests/manageRequests.html',
    directives: [ NgFor, NgIf ]
})
export class ManageRequests {
    http: HttpAdvanced;
    requests: Request[] = new Array();

    approveSlot(slotId) {
        this.http.postWithRes('/admin/requests/' + slotId + '/allow', '', (res) => {
            for (let i in this.requests) {
                if (this.requests[i].id === slotId) {
                    this.requests.splice(i, 1);
                    break;
                }
            }
        });
    }

    rejectSlot(slotId) {
        this.http.postWithRes('/admin/requests/' + slotId + '/deny', '', (res) => {
            for (let i in this.requests) {
                if (this.requests[i].id === slotId) {
                    this.requests.splice(i, 1);
                    break;
                }
            }
        });
    }

    constructor(http: HttpAdvanced) {
       this.http = http;

       http.get('/admin/requests/list', (res) => {
           for (let i in res) {
               this.requests.push(new Request(res[i]));
           }
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
