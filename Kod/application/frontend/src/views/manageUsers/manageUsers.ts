import {Component} from 'angular2/core';
import {Location, RouteConfig, RouterLink, Router, CanActivate} from 'angular2/router';

import { HttpAdvanced } from '../../services/services';

@Component({
  selector: 'ManageUsers',
  templateUrl: './dist/views/manageUsers/manageUsers.html'
})
export class ManageUsers {
    http: HttpAdvanced;
    router: Router;
    users: any[];
    editable: boolean = false;

    toggleEditable() { this.editable = !this.editable; }
    constructor(http: HttpAdvanced, router: Router) {
        this.http = http;
        this.router = router;
        http.get('/admin/users/list', (res) => {
            this.users = new Array();
            for (let i in res) this.users.push(res[i]);
        });
    }

    editUser(userId) {
        this.router.navigate(['/Settings', 'EditUser', { userId: userId }]);
    }

    deleteUser(userId) {
        for (let i in this.users) {
            let ii = parseInt(i);
            if (this.users[ii].id.toString() === userId.toString()) {
                this.users.splice(ii, 1);
            }
        }
        this.http.postWithBothMsg('admin/users/' + userId + '/delete', '');
    }
}
