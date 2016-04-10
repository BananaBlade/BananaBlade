
import { Component } from 'angular2/core';
import { Location, RouteConfig, RouterLink, Router, CanActivate } from 'angular2/router';
import { COMMON_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';

import { Form, HttpAdvanced, MsgService } from '../../services/services';

@Component({
    selector: 'ManageAdmins',
    templateUrl: './dist/views/manageAdmins/manageAdmins.html',
    directives: [COMMON_DIRECTIVES, FORM_DIRECTIVES]
})
export class ManageAdmins {
    http: HttpAdvanced;
    msgService : MsgService;
    admins: User[] = new Array();
    closestMatches: any[] = new Array();
    editable: boolean = false;
    userSearch: string = "";

    toggleEditable() {
        this.editable = !this.editable;
        this.closestMatches = new Array();
        this.userSearch = "";
    }

    onKeyPressed(charCode) {
        let query = "";
        if (charCode == 8) query = this.userSearch.slice(0, this.userSearch.length - 1);
        else query = this.userSearch ? (this.userSearch + String.fromCharCode(charCode)) : String.fromCharCode(charCode);

        if (query && query.length >= 3) {
            this.http.get('/users/search/' + query, (res) => {
                this.closestMatches = new Array();
                for (let i in res) {
                    this.closestMatches.push(new User(res[i]));
                }
            });
        }
        else {
            this.closestMatches = new Array();
        }
    }

    enterCheck(event) {
        let keyCode = event.keyCode;
        if (keyCode == 13 && this.closestMatches.length > 0) {
            this.addAdmin();
        }
        else if (keyCode >= 65 && keyCode <= 90 || keyCode >= 97 && keyCode <= 122 || keyCode == 8) this.onKeyPressed(keyCode)
    }

    addAdmin() {
        if (this.closestMatches.length == 0) return;
        if ( this.admins.length > 9 ){
            this.msgService.setMessage( 'U sustavu već postoji 10 administratora, nije moguće dodati još jednog.', 'error' );
            this.userSearch = "";
            this.closestMatches = new Array();
            return;
        }
        let id = this.closestMatches[0].id;
        this.http.postWithBothMsg('/owner/admins/add/' + id, '');
        this.admins.push(this.closestMatches[0]);

        this.userSearch = "";
        this.closestMatches = new Array();
    }

    removeAdmin(removedAdminId) {
        for (let i in this.admins) {
            let ii = parseInt(i);
            if (this.admins[ii].id === removedAdminId) {
                this.admins.splice(ii, 1);
                break;
            }
        }
        this.http.post('/owner/admins/remove/' + removedAdminId.toString(), '');
    }

    constructor(http: HttpAdvanced, msgService : MsgService) {
        this.http = http;
        this.msgService = msgService;

        http.get('/owner/admins/list', (res) => {
            this.admins = new Array();
            for (let i in res) {
                this.admins.push(new User(res[i]));
            }
        });
    }
}

class User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    year_of_birth: string;
    occupation: string;
    account_type: number;

    constructor(obj: Object) {
        this.id = obj['id'];
        this.first_name = obj['first_name'];
        this.last_name = obj['last_name'];
        this.email = obj['email'];
        this.year_of_birth = obj['year_of_birth'];
        this.occupation = obj['occupation'];
        this.account_type = obj['account_type'];
    }
}
