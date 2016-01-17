import { Component, Input } from 'angular2/core';
import { FORM_DIRECTIVES, COMMON_DIRECTIVES, FormBuilder, ControlGroup, Validators, Control } from 'angular2/common';
import { Http } from 'angular2/http';
import { RouterLink } from 'angular2/router';
import 'rxjs/Rx';

import { Form, urlEncode } from '../../services/utilities';

@Component({
    selector: 'header-bar',
    templateUrl: './dest/components/headerBar/headerBar.html',
    directives: [ FORM_DIRECTIVES, COMMON_DIRECTIVES, RouterLink ]
})
export class HeaderBar {
    @Input() isLoggedIn : boolean;
    loginForm: Form;
    http: Http;

    constructor(fb: FormBuilder, http: Http) {
        this.http = http;

        let loginEntities = ['email', 'password'];
        this.loginForm = new Form(fb, http, loginEntities, '/user/auth/login');
    }

    onSubmit(value: String): void {
        console.log(value);
        this.http.post('/user/auth/login', urlEncode(value)).map((res) => res.json()).subscribe((res) => {
            console.log(res);
            document.location.reload(true);
        }, (err) => console.log(err));
    }
}
