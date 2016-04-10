import { Component } from 'angular2/core';
import { Location, RouteConfig, RouterLink, Router, CanActivate } from 'angular2/router';
import { COMMON_DIRECTIVES, FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators, Control } from 'angular2/common';

import { HttpAdvanced, AuthService } from '../../services/services';

import { Messages } from '../../components/messages/messages';
import { Player } from '../../components/player/player';
import { Popular } from '../../components/popular/popular';
import { RadioDescr } from '../../components/radioDescr/radioDescr';
import { Schedule } from '../../components/schedule/schedule';
import { Station } from '../../components/station/station';

@Component({
    selector: 'Index',
    directives: [ Messages, Player, Popular, RadioDescr, Schedule, Station ],
    templateUrl: './dist/views/index/index.html'
})
export class Index {
    http: HttpAdvanced;
    registerForm: ControlGroup;
    authService: AuthService;

    first_name: Control;
    last_name: Control;
    email: Control;
    password: Control;
    password2: Control;
    year_of_birth: Control;
    occupation: Control;

    onSubmitRegistration(values: String): void {
        this.http.post('/user/auth/register', values);
    }

    constructor(fb: FormBuilder, http: HttpAdvanced, authService: AuthService) {
        this.http = http;
        this.authService = authService;

        this.first_name = new Control('', Validators.required);
        this.last_name = new Control('', Validators.required);
        this.email = new Control('', Validators.required);
        this.password = new Control('', Validators.required);
        this.password2 = new Control('', Validators.required);
        this.year_of_birth = new Control('', Validators.required);
        this.occupation = new Control('', Validators.required);

        this.registerForm = fb.group({
            'first_name': this.first_name,
            'last_name': this.last_name,
            'email': this.email,
            'password': this.password,
            'password2': this.password2,
            'year_of_birth': this.year_of_birth,
            'occupation': this.occupation
        });
    }

    resetControls(){
        for (let i in this.registerForm.controls) {
            this.registerForm.controls[i].value = '';
            this.registerForm.controls[i].updateValueAndValidity();
            this.registerForm.updateValueAndValidity();
        }
    }
}
