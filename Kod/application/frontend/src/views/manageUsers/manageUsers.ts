
import {View, Component} from 'angular2/core';
import {Location, RouteConfig, RouterLink, Router, CanActivate} from 'angular2/router';
import { Http } from 'angular2/http';

@Component({
  selector: 'ManageUsers',
  templateUrl: './dest/views/manageUsers/manageUsers.html'
})
export class ManageUsers {
    http: Http;
    router: Router;
    users: any[];


    constructor(http: Http, router: Router) {
        this.http = http;
        this.router = router;

        http.get('/admin/users/list').map((res) => res.json()).subscribe((res) => {
            console.log(res);
            for (let i in res.data) {
                this.users.push(res.data[i]);
            }
        })
    }

    editUser(userId) {
        this.router.navigate(['EditUser', { userId: userId }]);
    }

    deleteUser(userId) {
        for (let i in this.users) {
            if (this.users[i].id.toString() === userId.toString()) {
                this.users.splice(i, 1);
            }
        }
        this.http.post('admin/users/' + userId + '/delete', '').map((res) => res.json()).subscribe((res) => console.log(res), (err) => console.log(err));
    }
}