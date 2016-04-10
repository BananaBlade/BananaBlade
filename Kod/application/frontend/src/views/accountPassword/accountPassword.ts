
import {Component} from 'angular2/core';
import {Location, RouteConfig, RouterLink, Router} from 'angular2/router';

import { HttpAdvanced, AuthService, MsgService } from '../../services/services';

@Component({
    selector: 'AccountPassword',
    templateUrl: './dist/views/accountPassword/accountPassword.html'
})
export class AccountPassword {

    http: HttpAdvanced;
    authService: AuthService;
    msgService: MsgService;

    old_password: string = "";
    new_password1: string = "";
    new_password2: string = "";

    constructor(http: HttpAdvanced, authService: AuthService, msgService: MsgService) {
        this.http = http;
        this.authService = authService;
        this.msgService = msgService;
    }

    submitChange() {
        this.http.postWithBothMsg('/user/account/change_password', { 
            old_password: this.old_password,
            new_password1: this.new_password1,
            new_password2: this.new_password2 }, (res) => {
                this.old_password = "";
                this.new_password1 = "";
                this.new_password2 = "";
            });
    }
}
