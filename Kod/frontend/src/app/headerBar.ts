import { Component } from 'angular2/core';
import {
    FORM_DIRECTIVES, COMMON_DIRECTIVES,
    FormBuilder, ControlGroup, Validators, Control
} from 'angular2/common';
import { Http } from 'angular2/http';
import 'rxjs/Rx';

import { urlEncode } from '../app/urlEncoder';

@Component({
    selector: 'header-bar',
    templateUrl: './dest/app/headerBar.html',
    styles: [],
    directives: [ FORM_DIRECTIVES, COMMON_DIRECTIVES ]
})
export class HeaderBar {
    // @Input() modelName
    // @Output() eventEmitterName
    http: Http;

    loginForm: ControlGroup;

    email: Control;
    password: Control;

    emailModel: string;
    passwordModel: string;

    constructor(fb: FormBuilder, http: Http) {
        this.http = http;

        this.email = new Control('', Validators.required);
        this.password = new Control('', Validators.required);

        this.loginForm = fb.group({
            'email': this.email,
            'password': this.password
        });
    }

    onSubmit(value: string) {
        let data = { 'email': this.emailModel, 'password': this.passwordModel };

        this.http.post('http://localhost:5000/user/auth/login', urlEncode(data))
            .map((res) => res.json()).map((text) => {
                console.log('map');
                console.log(text);
                return text;
            }).subscribe((val) => {
                console.log('subscribe');
                console.log(val);
            });
    }
}
