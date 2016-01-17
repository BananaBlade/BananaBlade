
import { View, Component } from 'angular2/core';
import { Location, RouteConfig, RouterLink, Router, CanActivate } from 'angular2/router';
import { CORE_DIRECTIVES, FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators, Control } from 'angular2/common';
import { Http } from 'angular2/http';

import { urlEncode } from '../../services/utilities';
import { Player } from '../../components/player/player';
import { Schedule } from '../../components/schedule/schedule';

@Component({
    selector: 'Index',
    directives: [ Player, Schedule ],
    templateUrl: './dest/views/index/index.html'
})
export class Index {
    http: Http;
    registerForm: ControlGroup;

    first_name: Control;
    last_name: Control;
    email: Control;
    password: Control;
    password2: Control;
    year_of_birth: Control;
    occupation: Control;


    onSubmitRegistration(value: String): void {
        this.http.post('/user/auth/register', urlEncode(value)).map((resp) => resp.text()).subscribe((resp) => console.log(resp), (err) => console.log(err));
    }

    constructor(fb: FormBuilder, http: Http) {
        this.http = http;

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
}
