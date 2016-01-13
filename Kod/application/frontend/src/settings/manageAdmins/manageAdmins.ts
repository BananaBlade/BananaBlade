
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
    admins: Admin[];

    editable: boolean = false;

    toggleEditable() {
        this.editable = !this.editable;
    }

    constructor(http: Http) {
        this.editable = false;
        this.admins = new Array();
        http.get('/owner/admins/list').map((res) => res.json().data).subscribe((res) => {
            for (let i in res) {
                let admin = new Admin(res[i]);
                this.admins.push(admin);
            }
        });
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