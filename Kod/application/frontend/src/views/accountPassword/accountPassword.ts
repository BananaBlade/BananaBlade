
import {View, Component} from 'angular2/core';
import {Location, RouteConfig, RouterLink, Router} from 'angular2/router';

import { HttpAdvanced, AuthService, MsgService } from '../../services/services';

@Component({
    selector: 'AccountPassword',
    templateUrl: './dest/views/accountPassword/accountPassword.html'
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
        this.http.postWithRes('/user/account/change_password', { 
            old_password: this.old_password, 
            new_password1: this.new_password1, 
            new_password2: this.new_password2 }, (res) => {
                console.log(res);
                this.msgService.setMessage('Uspješno promijenjena lozinka.');
                this.old_password = "";
                this.new_password1 = "";
                this.new_password2 = "";
            });
    }
}