
import { View, Component } from 'angular2/core';
import { Location, RouteConfig, RouterLink, Router, RouteParams } from 'angular2/router';
import { CORE_DIRECTIVES, FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators, Control } from 'angular2/common';
import { Http } from 'angular2/http';

import { urlEncode } from '../../services/utilities';

@Component({
  selector: 'EditUser',
  templateUrl: './dest/views/editUser/editUser.html'
})
export class EditUser {
    http: Http;

    userId: string;
    userForm: ControlGroup;

    first_name: Control = new Control('', Validators.required);
    last_name: Control = new Control('', Validators.required);
    email: Control = new Control('', Validators.required);
    year_of_birth: Control = new Control('', Validators.required);
    occupation: Control = new Control('', Validators.required);

    account_type: string;

    constructor(http: Http, routeParams: RouteParams, fb: FormBuilder) {
        this.http = http;

        this.userId = routeParams.get('userId');

        this.userForm = fb.group({
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            year_of_birth: this.year_of_birth,
            occupation: this.occupation
        });

        http.get('admin/users/' + this.userId + '/get').map((res) => res.json()).subscribe((res) => {
            console.log(res);
            for (let name in res.data) {
                console.log(name);
                if (name == 'account_type') {
                    if (res.data.account_type == 1) this.account_type = "korisnik";
                    else if (res.data.account_type == 2) this.account_type = "urednik";
                    else if (res.data.account_type == 3) this.account_type = "administrator";
                    else if (res.data.account_type == 4) this.account_type = "vlasnik";
                }
                else if (name == 'id') continue;
                else this[name].updateValue(res.data[name]);
            }
        }, (err) => console.log(err));
    }

    onSubmit(values) {
        this.http.post('/admin/users/' + this.userId + '/modify', urlEncode(values)).map((res) => res.json()).subscribe((res) => console.log(res), (err) => console.log(err));
    }
}