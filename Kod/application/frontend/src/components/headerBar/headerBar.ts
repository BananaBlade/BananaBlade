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

    userName: string;
    userRole: string;

    constructor(fb: FormBuilder, http: Http, authService: AuthService) {
        this.http = http;
        this.authService = authService;
        
        this.updateLoginStatus();

        let loginEntities = ['email', 'password'];
        this.loginForm = new Form(fb, http, loginEntities, '/user/auth/login');
    }

    updateLoginStatus() {
        this.isLoggedIn = this.authService.isLoggedIn();
        this.authService.storeUserAuthentication(() => {
            this.isLoggedIn = this.authService.isLoggedIn();

            this.http.get('/user/account/get').map((res) => res.json()).subscribe((res) => {
                console.log(res);
                this.userName = res.data.first_name + ' ' + res.data.last_name;
                let role = res.data.account_type;
                if (role == 1) this.userRole = "kosinik";
                if (role == 2) this.userRole = "urednik";
                if (role == 3) this.userRole = "administrator";
                if (role == 4) this.userRole = "vlasnik";
            }, (err) => console.log(err));
        });
    }

    onSubmit(value: String): void {
        console.log(value);
        this.http.post('/user/auth/login', urlEncode(value)).map((res) => res.json()).subscribe((res) => {
            console.log(res);
            this.updateLoginStatus();
        }, (err) => console.log(err));
    }
}
