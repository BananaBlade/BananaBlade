
import { View, Component } from 'angular2/core';
import { Location, RouteConfig, RouterLink, Router, CanActivate } from 'angular2/router';
import { Http } from 'angular2/http';
import { NgSwitchWhen, NgSwitch, NgSwitchDefault, NgIf, NgFor, FORM_DIRECTIVES} from 'angular2/common';

import { Form } from '../../utilities';

@Component({
    selector: 'ManageAdmins',
    templateUrl: './dest/settings/manageAdmins/manageAdmins.html',
    directives: [NgSwitchWhen, NgSwitch, NgSwitchDefault, NgIf, NgFor, FORM_DIRECTIVES]
})
export class ManageAdmins {
    http: Http;
    admins: Admin[] = new Array();
    normalUsers: any[] = new Array();
    closestMatches: any[] = new Array();
    editable: boolean = false;
    userSearch: string = "";

    matching: boolean = false;
    matchingId: number = -1;
    matchingIndex: number = -1;

    toggleEditable() {
        this.editable = !this.editable;
    }

    checkIfMatching(searchString) {
        for (let i in this.normalUsers) {
            let fullName = this.normalUsers[i].first_name + ' ' + this.normalUsers[i].last_name;
            if (fullName === searchString) {
                this.matching = true;
                this.matchingId = this.normalUsers[i].id;
                this.matchingIndex = i;
                return;
            }
        }
        this.matching = false;
        return;
    }

    onKeyPressed(event) {
        let count = 0;
        let enteredLetter = String.fromCharCode(event.keyCode);
        this.closestMatches = new Array();
        for (let i in this.normalUsers) {
            if (count === 3) return;
            let fullName = this.normalUsers[i].first_name + ' ' + this.normalUsers[i].last_name;
            if (fullName.indexOf(this.userSearch + enteredLetter) === 0) {
                count += 1;
                this.closestMatches.push(this.normalUsers[i]);
            }
        }
        this.checkIfMatching(this.userSearch + enteredLetter);
    }

    addAdmin() {
        if (this.matching) {
            this.userSearch = "";
            this.matching = false;
            this.closestMatches = new Array();

            this.admins.push(this.normalUsers[this.matchingIndex]);
            this.normalUsers.splice(this.matchingIndex, 1);

            this.http.post('/owner/admins/add/' + this.matchingId.toString(), '').map((res) => res.json()).subscribe((data) => console.log(data), (err) => console.log(err));
        }
    }

    removeAdmin(removedAdminId) {
        for (let i in this.admins) {
            if (this.admins[i].id === removedAdminId) {
                this.normalUsers.push(this.admins[i]);
                this.admins.splice(i, 1);
                break;
            }
        }
        this.http.post('/owner/admins/remove/' + removedAdminId.toString(), '').map((res) => res.json()).subscribe((data) => console.log(data), (err) => console.log(err));
    }

    constructor(http: Http) {
        this.http = http;
        http.get('/owner/admins/list').map((res) => res.json().data).subscribe((res) => {
            for (let i in res) {
                let admin = new Admin(res[i]);
                this.admins.push(admin);
            }
        }, (err) => console.log(err));
        http.get('/admin/users/list').map((res) => res.json().data).subscribe((data) => {
            this.normalUsers = data;
            console.log(data);
        }, (err) => console.log(err));
    }
}

class Admin {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    year_of_birth: string;
    occupation: string;

    constructor(obj: Object) {
        this.id = obj['id'];
        this.first_name = obj['first_name'];
        this.last_name = obj['last_name'];
        this.email = obj['email'];
        this.year_of_birth = obj['year_of_birth'];
        this.occupation = obj['occupation'];
    }
}