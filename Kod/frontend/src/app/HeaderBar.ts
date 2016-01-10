import { Component } from 'angular2/core';
import { 
    FORM_DIRECTIVES, COMMON_DIRECTIVES,
    FormBuilder, ControlGroup, Validators, Control
} from 'angular2/common';
import { Http } from 'angular2/http';
import 'rxjs/Rx';

@Component({ 
    selector: 'header-bar',
    templateUrl: './dest/App/HeaderBar.html',
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
        console.log('gs');
        this.http.post('http://localhost:5000/user/auth/login', JSON.stringify({ 'email': this.emailModel, 'password': this.passwordModel }))
            .map((res) => res.json()).map((text) => console.log(text)).subscribe((val) => console.log(val));
    }
}