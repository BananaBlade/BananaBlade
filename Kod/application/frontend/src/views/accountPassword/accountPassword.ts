
import {View, Component} from 'angular2/core';
import {Location, RouteConfig, RouterLink, Router} from 'angular2/router';

import { HttpAdvanced } from '../../services/services';

@Component({
    selector: 'AccountPassword',
    templateUrl: './dest/views/accountPassword/accountPassword.html'
})
export class AccountPassword {

    http: HttpAdvanced;

    old_password: string = "";
    new_password1: string = "";
    new_password2: string = "";

    constructor(http: HttpAdvanced) {
        this.http = http;
    }

    submitChange() {
        this.http.post('/user/account/change_password', { old_password: this.old_password, new_password1: this.new_password1, new_password2: this.new_password2 });
    }
}