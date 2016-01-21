
import {View, Component} from 'angular2/core';
import {Location, RouteConfig, RouterLink, Router, CanActivate} from 'angular2/router';

import { HttpAdvanced } from '../../services/services';

@Component({
    selector: 'AccountDelete',
    templateUrl: './dest/views/accountDelete/accountDelete.html'
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
            this.http.postWithRes('/user/account/delete', { password: this.password }, (res) => { 
                console.log(res); 
                this.router.navigate(['Index']); 
            });
        }
    }
}
