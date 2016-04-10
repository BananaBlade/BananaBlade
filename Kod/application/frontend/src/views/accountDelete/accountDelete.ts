
import {Component} from 'angular2/core';
import {Location, RouteConfig, RouterLink, Router, CanActivate} from 'angular2/router';

import { HttpAdvanced } from '../../services/services';

@Component({
    selector: 'AccountDelete',
    templateUrl: './dist/views/accountDelete/accountDelete.html'
})
export class AccountDelete {
    password: string = "";
    http: HttpAdvanced;
    router: Router;

    constructor(http: HttpAdvanced, router: Router) {
        this.http = http;
        this.router = router;
    }

    submitDelete() {
        if (this.password) {
            this.http.postWithBothMsg('/user/account/delete', { password: this.password }, (res) => {
                this.router.navigate(['Index']); 
            });
        }
    }
}
