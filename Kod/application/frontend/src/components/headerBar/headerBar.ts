import { Component, Input } from 'angular2/core';
import { FORM_DIRECTIVES, COMMON_DIRECTIVES, ControlGroup, Validators, Control } from 'angular2/common';
import { RouterLink } from 'angular2/router';

import { AuthService, Form, FormBuilderAdvanced, HttpAdvanced } from '../../services/services';

@Component({
    selector: 'header-bar',
    templateUrl: './dist/components/headerBar/headerBar.html',
    directives: [ FORM_DIRECTIVES, COMMON_DIRECTIVES, RouterLink ]
})
export class HeaderBar {
    loginForm: Form;
    http: HttpAdvanced;
    authService: AuthService;

    userName: string;
    userRole: string;

    constructor(fb: FormBuilderAdvanced, http: HttpAdvanced, authService: AuthService) {
        this.http = http;
        this.authService = authService;

        this.authService.updateLoginStatus();

        let loginEntities = ['email', 'password'];
        this.loginForm = fb.create(loginEntities, '/user/auth/login');
    }


    onSubmit(value): void {
        this.authService.loginX(value.email, value.password);
    }
}
