
import {View, Component} from 'angular2/core';
import {Location, RouteConfig, RouterLink, Router, CanActivate} from 'angular2/router';
import { COMMON_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators, Control } from 'angular2/common';


import { HttpAdvanced } from '../../services/services';

@Component({
    selector: 'AccountData',
    directives: COMMON_DIRECTIVES,
    templateUrl: './dest/views/accountData/accountData.html'
})
export class AccountData {
    http: HttpAdvanced;

    userForm: ControlGroup;

    first_name: Control = new Control('', Validators.required);
    last_name: Control = new Control('', Validators.required);
    email: Control = new Control('', Validators.required);
    year_of_birth: Control = new Control('', Validators.required);
    occupation: Control = new Control('', Validators.required);

    account_type: string;
    editable : boolean = false;

    constructor(http: HttpAdvanced, fb: FormBuilder) {
        this.http = http;

        this.userForm = fb.group({
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            year_of_birth: this.year_of_birth,
            occupation: this.occupation
        });

        http.get('user/account/get', (res) => {
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
        });
    }

    toggleEditable(){ this.editable = !this.editable; }

    onSubmit(values) {
        this.http.postWithRes('/user/account/modify', values, (res) => { 
            console.log(res); 
            this.editable = false; 
        });
    }
}
