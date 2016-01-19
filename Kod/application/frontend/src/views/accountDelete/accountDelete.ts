
import {View, Component} from 'angular2/core';
import {Location, RouteConfig, RouterLink, Router, CanActivate} from 'angular2/router';
import { Http } from 'angular2/http';
import { urlEncode } from '../../services/utilities';

@Component({
    selector: 'AccountDelete',
    templateUrl: './dest/views/accountDelete/accountDelete.html'
})
export class AccountDelete {
    password: string = "";
    http: Http;

    constructor(http: Http) {
        this.http = http;
    }

    submitDelete() {
        if (this.password) {
            this.http.post('/user/account/delete', urlEncode({ password: this.password })).map((res) => res.json()).subscribe((res) => console.log(res), (err) => console.log(err));
        }
    }
}