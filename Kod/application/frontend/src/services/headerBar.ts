import { Component, Input } from 'angular2/core';
import {
    FORM_DIRECTIVES, COMMON_DIRECTIVES,
    FormBuilder, ControlGroup, Validators, Control
} from 'angular2/common';
import { Http } from 'angular2/http';
import 'rxjs/Rx';

import { Form } from './utilities';

@Component({
    selector: 'header-bar',
    templateUrl: './dest/app/headerBar.html',
    styles: [],
    directives: [ FORM_DIRECTIVES, COMMON_DIRECTIVES ]
})
export class HeaderBar {
    @Input() isFixed : boolean
    @Input() isLoggedIn : boolean
    loginForm: Form;

    constructor(fb: FormBuilder, http: Http) {
        let loginEntities = ['email', 'password'];
        this.loginForm = new Form(fb, http, loginEntities, '/user/auth/login');
    }
}
