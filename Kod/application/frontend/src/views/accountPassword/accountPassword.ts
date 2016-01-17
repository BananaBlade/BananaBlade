
import {View, Component} from 'angular2/core';
import {Location, RouteConfig, RouterLink, Router} from 'angular2/router';
import { Http } from 'angular2/http';
import { urlEncode } from '../../services/utilities';


@Component({
    selector: 'AccountPassword',
    templateUrl: './dest/views/accountPassword/accountPassword.html'
})
export class AccountPassword {

    http: Http;

    old_password: string = "";
    new_password1: string = "";
    new_password2: string = "";

    constructor(http: Http) {
        this.http = http;
    }

    submitChange() {
        this.http.post('/user/account/change_password', urlEncode({old_password: this.old_password, new_password1: this.new_password1, new_password2: this.new_password2 })).map((res) => res.json()).subscribe((res) => console.log(res), (err) => console.log(err));
    }
}