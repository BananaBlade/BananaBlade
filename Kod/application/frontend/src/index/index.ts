
import { View, Component } from 'angular2/core';
import { Location, RouteConfig, RouterLink, Router, CanActivate } from 'angular2/router';
import { CORE_DIRECTIVES, FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators, Control } from 'angular2/common';
import { Http } from 'angular2/http';

import { Form } from '../utilities';

@Component({
    selector: 'Index'
})
@View({
    templateUrl: './dest/index/index.html'
})
export class Index {
    registerForm: Form;

    constructor(fb: FormBuilder, http: Http) {
        let formNames = ['first_name', 'last_name', 'email', 'password', 'password2', 'year_of_birth', 'occupation'];
        this.registerForm = new Form(fb, http, formNames, '/user/auth/register');
    }
}