import { Component, Input } from 'angular2/core';
import { FORM_DIRECTIVES, COMMON_DIRECTIVES, FormBuilder, ControlGroup, Validators, Control } from 'angular2/common';
import { Http } from 'angular2/http';
import { RouterLink } from 'angular2/router';
import 'rxjs/Rx';

import { Form, urlEncode } from '../../services/utilities';
import { AuthService } from '../../services/authService';

@Component({
    selector: 'header-bar',
    templateUrl: './dest/components/headerBar/headerBar.html',
    directives: [ FORM_DIRECTIVES, COMMON_DIRECTIVES, RouterLink ]
})
export class HeaderBar {
    isLoggedIn : boolean;
    loginForm: Form;
    http: Http;
    authService: AuthService;

    constructor(fb: FormBuilder, http: Http, authService: AuthService) {
        this.http = http;
        this.authService = authService;
        authService.storeUserAuthentication(() => this.isLoggedIn = authService.isLoggedIn());


        let loginEntities = ['email', 'password'];
        this.loginForm = new Form(fb, http, loginEntities, '/user/auth/login');
    }

    onSubmit(value: String): void {
        console.log(value);
        this.http.post('/user/auth/login', urlEncode(value)).map((res) => res.json()).subscribe((res) => {
            console.log(res);
            this.authService.storeUserAuthentication();
        }, (err) => console.log(err));
    }
}
