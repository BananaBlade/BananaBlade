
import { Component } from 'angular2/core';
import { RouteParams } from 'angular2/router';
import { COMMON_DIRECTIVES, FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators, Control } from 'angular2/common';

import { HttpAdvanced, MsgService } from '../../services/services';

@Component({
  selector: 'EditUser',
  templateUrl: './dist/views/editUser/editUser.html',
  directives: [ COMMON_DIRECTIVES ]
})
export class EditUser {
    http: HttpAdvanced;
    msgService: MsgService;

    userId: string;
    userForm: ControlGroup;

    first_name: Control = new Control('', Validators.required);
    last_name: Control = new Control('', Validators.required);
    email: Control = new Control('', Validators.required);
    year_of_birth: Control = new Control('', Validators.required);
    occupation: Control = new Control('', Validators.required);

    account_type: string;
    editable: boolean = false;

    constructor(http: HttpAdvanced, routeParams: RouteParams, fb: FormBuilder, msgService: MsgService) {
        this.http = http;
        this.msgService = msgService;

        this.userId = routeParams.get('userId');

        this.userForm = fb.group({
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            year_of_birth: this.year_of_birth,
            occupation: this.occupation
        });

        this.resetForm();
    }

    resetForm() {
        this.http.get('admin/users/' + this.userId + '/get', (res) => {
            for (let name in res) {
                if (name == 'account_type') {
                    if (res.account_type == 1) this.account_type = "korisnik";
                    else if (res.account_type == 2) this.account_type = "urednik";
                    else if (res.account_type == 3) this.account_type = "administrator";
                    else if (res.account_type == 4) this.account_type = "vlasnik";
                }
                else if (name == 'id') continue;
                else this[name].updateValue(res[name]);
            }
        });
    }

    toggleEditable(){
        this.resetForm();
        this.editable = !this.editable; 
    }

    onSubmit(values) {
        this.http.postWithRes('/admin/users/' + this.userId + '/modify', values, (res) => {
            this.msgService.setMessage(res.success_message);
            this.editable = false; 
        });
    }
}
