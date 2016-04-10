
import {Component} from 'angular2/core';
import {Location, RouteConfig, RouterLink, Router, CanActivate} from 'angular2/router';
import { COMMON_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators, Control } from 'angular2/common';


import { HttpAdvanced, FormBuilderAdvanced, Form } from '../../services/services';

@Component({
    selector: 'AccountData',
    directives: COMMON_DIRECTIVES,
    templateUrl: './dist/views/accountData/accountData.html'
})
export class AccountData {
    http: HttpAdvanced;

    userForm: Form;

    account_type: string;
    editable : boolean = false;

    constructor(http: HttpAdvanced, fb: FormBuilderAdvanced) {
        this.http = http;

        let controlsNames = ["first_name", "last_name", "email", "year_of_birth", "occupation"];
        this.userForm = fb.create(controlsNames, 'user/account/modify');

        this.resetForm();
    }

    resetForm() {
        this.http.get('user/account/get', (res) => {
            for (let name in res) {
                if (name == 'account_type') {
                    if (res.account_type == 1) this.account_type = "korisnik";
                    else if (res.account_type == 2) this.account_type = "urednik";
                    else if (res.account_type == 3) this.account_type = "administrator";
                    else if (res.account_type == 4) this.account_type = "vlasnik";
                }
                else if (name == 'id') continue;
                else this.userForm.controls[name].updateValue(res[name]);
            }
        });
    }

    toggleEditable(){
        this.resetForm();
        this.editable = !this.editable;
    }

    onSubmit(values) {
        console.log(values);
        this.http.postWithBothMsg('/user/account/modify', values, (res) => {
            this.editable = false;
        });
    }
}
