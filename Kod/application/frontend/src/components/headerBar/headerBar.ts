import { Component, Input } from 'angular2/core';
import { FORM_DIRECTIVES, COMMON_DIRECTIVES, ControlGroup, Validators, Control } from 'angular2/common';
import { RouterLink } from 'angular2/router';

import { AuthService, Form, FormBuilderAdvanced, HttpAdvanced } from '../../services/services';

@Component({
    selector: 'header-bar',
    templateUrl: './dest/components/headerBar/headerBar.html',
    directives: [ FORM_DIRECTIVES, COMMON_DIRECTIVES, RouterLink ]
})
export class HeaderBar {
    isLoggedIn : boolean;
    loginForm: Form;
    http: HttpAdvanced;
    authService: AuthService;

    userName: string;
    userRole: string;

    constructor(fb: FormBuilderAdvanced, http: HttpAdvanced, authService: AuthService) {
        this.http = http;
        this.authService = authService;

        this.updateLoginStatus();

        let loginEntities = ['email', 'password'];
        this.loginForm = fb.create(loginEntities, '/user/auth/login');
    }

    updateLoginStatus() {
        this.isLoggedIn = this.authService.isLoggedIn();
        this.authService.storeUserAuthentication(() => {
            this.isLoggedIn = this.authService.isLoggedIn();

            this.http.get('/user/account/get', (data) => {
                console.log(data);
                this.userName = data.first_name + ' ' + data.last_name;
                let role = data.account_type;
                if (role == 1) this.userRole = "korisnik";
                if (role == 2) this.userRole = "urednik";
                if (role == 3) this.userRole = "administrator";
                if (role == 4) this.userRole = "vlasnik";
            });
        });
    }

    onSubmit(value: String): void {
        console.log(value);
        this.http.postWithRes('/user/auth/login', value, (res) => {
            console.log(res);
            this.updateLoginStatus();
        });
    }
}
