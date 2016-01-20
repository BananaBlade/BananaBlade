
import { View, Component } from 'angular2/core';
import { Location, RouteConfig, RouterLink, Router, CanActivate } from 'angular2/router';
import { Http } from 'angular2/http';
import { COMMON_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';

import { Form } from '../../services/utilities';

@Component({
    selector: 'ManageAdmins',
    templateUrl: './dest/views/manageAdmins/manageAdmins.html',
    directives: [COMMON_DIRECTIVES, FORM_DIRECTIVES]
})
export class ManageAdmins {
    http: Http;
    admins: User[] = new Array();
    closestMatches: any[] = new Array();
    editable: boolean = false;
    userSearch: string = "";

    toggleEditable() {
        this.editable = !this.editable;
    }

    onKeyPressed(event?) {
        let count = 0;
        let enteredLetter = event ? String.fromCharCode(event.keyCode) : '';

        if (this.userSearch.length < 2) return;

        this.http.get('/users/search/' + this.userSearch + enteredLetter).subscribe((res) => {
            this.closestMatches = new Array();
            console.log(res);
            let data = res.json().data;
            for (let i = 0; i < 3 && data[i]; i += 1) {
                this.closestMatches.push(data[i]);
            }
        }, (err) => console.log(err));
    }

    enterCheck(event) {
        if (event.keyCode == 13) {
            this.addAdmin();
        }
    }

    addAdmin() {
        this.http.post('/owner/admins/add/' + this.closestMatches[0].id, '').map((res) => res.text()).subscribe((data) => console.log(data), (err) => console.log(err));
        this.admins.push(this.closestMatches[0]);

        this.userSearch = "";
        this.closestMatches = new Array();
    }

    removeAdmin(removedAdminId) {
        for (let i in this.admins) {
            if (this.admins[i].id === removedAdminId) {
                this.admins.splice(i, 1);
                break;
            }
        }
        this.http.post('/owner/admins/remove/' + removedAdminId.toString(), '').subscribe((data) => console.log(data), (err) => console.log(err));
    }

    constructor(http: Http) {
        this.http = http;

        http.get('/admin/editors/list').subscribe((res) => {
            this.admins = new Array();
            let data = res.json().data;
            for (let i in data) {
                this.admins.push(new User(data[i]));
            }
        }, (err) => console.log(err));
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
